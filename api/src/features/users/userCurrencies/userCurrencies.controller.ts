import { NextFunction, Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { UserCurrency } from "../../currencies/user-currencies/userCurrency";
import { Currency } from "../../currencies/currency";
import { CurrencyExchange } from "../../currencies/exchange/currencyExchange";
import appAssert from "../../../utils/utilities/appAssert";
import { BAD_REQUEST } from "../../../utils/constants/http";
import { Op } from "sequelize";

export const getUserCurrenciesHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const userCurrencies = await UserCurrency.findAll({
        where: {
            userId: req.userId,
        },
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
        order: [["isPrimary", "DESC"], ["createdAt", "ASC"]],
    });

    // Find primary currency
    const primaryCurrency = userCurrencies.find((uc) => uc.isPrimary);
    const primaryCurrencyCode = primaryCurrency?.currency?.code;

    // Calculate rates for each currency
    const currenciesWithRates = await Promise.all(
        userCurrencies.map(async (userCurrency) => {
            if (!userCurrency.currency) return null;
            const currencyCode = userCurrency.currency.code;
            let rate = 1;

            if (primaryCurrencyCode) {
                if (currencyCode === primaryCurrencyCode) {
                    rate = 1;
                } else {
                    // Try to find direct exchange rate: primary -> currency
                    let exchange = await CurrencyExchange.findOne({
                        where: {
                            baseCurrencyCode: primaryCurrencyCode,
                            targetCurrencyCode: currencyCode,
                        },
                        order: [["rateDate", "DESC"]],
                    });

                    if (exchange) {
                        rate = parseFloat(exchange.rate.toString());
                    } else {
                        // Try reverse: currency -> primary, then invert
                        exchange = await CurrencyExchange.findOne({
                            where: {
                                baseCurrencyCode: currencyCode,
                                targetCurrencyCode: primaryCurrencyCode,
                            },
                            order: [["rateDate", "DESC"]],
                        });

                        if (exchange) {
                            rate = 1 / parseFloat(exchange.rate.toString());
                        }
                    }
                }
            }

            return {
                ...userCurrency.toJSON(),
                rateToPrimary: rate,
            };
        })
    );

    // Filter out null values
    const validCurrencies = currenciesWithRates.filter((item) => item !== null);

    return res.status(200).json({
        items: validCurrencies,
        primaryCurrency: primaryCurrencyCode || null,
        status: true,
        message: "User currencies fetched successfully",
    });
});

export const createUserCurrencyHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { currencyId } = req.body;

    appAssert(currencyId, BAD_REQUEST, "Currency ID is required");

    // Check if currency exists
    const currency = await Currency.findByPk(currencyId);
    appAssert(currency, BAD_REQUEST, "Currency not found");

    // Check if user already has this currency
    const existingUserCurrency = await UserCurrency.findOne({
        where: {
            userId: req.userId,
            currencyId: currencyId,
        },
    });

    appAssert(!existingUserCurrency, BAD_REQUEST, "Currency already added");

    // Create user currency
    const userCurrency = await UserCurrency.create({
        userId: req.userId,
        currencyId: currencyId,
        isPrimary: false,
    });

    // Fetch with currency included
    const userCurrencyWithCurrency = await UserCurrency.findByPk(userCurrency.id, {
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
    });

    return res.status(201).json({
        item: userCurrencyWithCurrency,
        status: true,
        message: "Currency added successfully",
    });
});

export const setPrimaryCurrencyHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    appAssert(id, BAD_REQUEST, "User currency ID is required");

    // Find the user currency
    const userCurrency = await UserCurrency.findOne({
        where: {
            id: parseInt(id),
            userId: req.userId,
        },
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
    });

    appAssert(userCurrency, BAD_REQUEST, "User currency not found");

    // Start transaction to update all currencies
    const sequelize = UserCurrency.sequelize;
    if (!sequelize) {
        throw new Error("Sequelize instance not found");
    }

    await sequelize.transaction(async (t) => {
        // Set all user currencies to non-primary
        await UserCurrency.update(
            { isPrimary: false },
            {
                where: { userId: req.userId },
                transaction: t,
            }
        );

        // Set the selected currency as primary
        await UserCurrency.update(
            { isPrimary: true },
            {
                where: { id: parseInt(id), userId: req.userId },
                transaction: t,
            }
        );
    });

    // Fetch updated currency with currency included
    const updatedUserCurrency = await UserCurrency.findByPk(parseInt(id), {
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
    });

    return res.status(200).json({
        item: updatedUserCurrency,
        status: true,
        message: "Primary currency updated successfully",
    });
});

export const deleteUserCurrencyHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    appAssert(id, BAD_REQUEST, "User currency ID is required");

    // Find the user currency
    const userCurrency = await UserCurrency.findOne({
        where: {
            id: parseInt(id),
            userId: req.userId,
        },
    });

    appAssert(userCurrency, BAD_REQUEST, "User currency not found");

    // Prevent deletion of primary currency
    appAssert(!userCurrency.isPrimary, BAD_REQUEST, "Cannot delete primary currency. Please set another currency as primary first.");

    // Delete the currency
    await userCurrency.destroy();

    return res.status(200).json({
        status: true,
        message: "Currency removed successfully",
    });
});

export const getUserCurrencyRateHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    appAssert(id, BAD_REQUEST, "User currency ID is required");

    // Find the user currency
    const userCurrency = await UserCurrency.findOne({
        where: {
            currencyId: parseInt(id),
            userId: req.userId,
        },
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
    });
    const primaryCurrency = await UserCurrency.findOne({
        where: {
            userId: req.userId,
            isPrimary: true,
        },
        include: [
            {
                model: Currency,
                as: "currency",
            },
        ],
    });

    if (!userCurrency || !primaryCurrency) {
        throw new Error("User currency or primary currency not found");
    }

    const currencyExchange = await CurrencyExchange.findOne({
        where: {
            [Op.or]: [
                {

                    baseCurrencyCode: userCurrency.currency?.code,
                    targetCurrencyCode: primaryCurrency.currency?.code,
                },
                {
                    baseCurrencyCode: primaryCurrency.currency?.code,
                    targetCurrencyCode: userCurrency.currency?.code,
                }
            ]
        },
    });

    if (!currencyExchange) {
        throw new Error("Currency exchange not found");
    }

    return res.status(200).json({
        item: {
            baseCurrencyCode: userCurrency.currency?.code,
            targetCurrencyCode: primaryCurrency.currency?.code,
            rate: String(currencyExchange?.targetCurrencyCode === primaryCurrency.currency?.code ? currencyExchange?.rate : 1 / currencyExchange?.rate),
        },
        status: true,
        message: "Currency rate fetched successfully",
    });
});