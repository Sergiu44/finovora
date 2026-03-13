import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnhancedAxios } from "../../../../configs/axios";
import ReactCountryFlag from "react-country-flag";
import { addUserCurrencyAsync } from "../../../../utils/actions/users/userCurrencies";
import { toast } from "sonner";

interface IAddUserCurrencyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddUserCurrencyModal(props: IAddUserCurrencyModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: currencies, isLoading } = useQuery({
    queryKey: [`cached-select-currencies`],
    queryFn: async () => {
      const response = await createEnhancedAxios().get(
        `${import.meta.env.VITE_API_URL}/currencies`
      );
      return response.data;
    },
  });

  const { data: userCurrencies } = useQuery({
    queryKey: ["user-currencies"],
    queryFn: async () => {
      const response = await createEnhancedAxios().get(
        `${import.meta.env.VITE_API_URL}/user-currencies`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  const { mutate: addCurrency, isPending } = useMutation({
    mutationFn: (currencyId: number) => addUserCurrencyAsync(currencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-currencies"] });
      toast.success("Currency added successfully");
      setSearchQuery("");
      props.setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add currency");
    },
  });

  // Get list of already added currency IDs
  const addedCurrencyIds = useMemo(() => {
    return new Set(
      userCurrencies?.items?.map(
        (uc: any) => uc.currency?.id || uc.currencyId
      ) || []
    );
  }, [userCurrencies]);

  // Filter currencies: exclude already added ones and filter by search query
  const filteredCurrencies = useMemo(() => {
    if (!currencies || !Array.isArray(currencies)) return [];

    return currencies.filter((currency: any) => {
      // Exclude already added currencies
      if (addedCurrencyIds.has(currency.id)) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        currency.code?.toLowerCase().includes(query) ||
        currency.name?.toLowerCase().includes(query) ||
        currency.countryCode?.toLowerCase().includes(query)
      );
    });
  }, [currencies, addedCurrencyIds, searchQuery]);

  const { open, setOpen } = props;

  const handleAddCurrency = (currencyId: number) => {
    addCurrency(currencyId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogHeader>
          <DialogTitle>Add Currency</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border/50 p-4">
          <div className="relative my-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10 rounded-base bg-muted/80 border-transparent"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto px-4 py-2">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">
              Loading currencies...
            </p>
          ) : filteredCurrencies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? "No currencies found" : "All currencies added"}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredCurrencies.map((currency: any) => (
                <button
                  key={currency.id || currency.code}
                  onClick={() => handleAddCurrency(currency.id)}
                  disabled={isPending}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    {currency.countryCode && (
                      <span className="text-4xl">
                        <ReactCountryFlag countryCode={currency.countryCode} />
                      </span>
                    )}
                    <div>
                      <span className="text-xl font-bold">{currency.code}</span>
                      <p className="text-sm text-muted-foreground">
                        {currency.name}
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserCurrencyModal;
