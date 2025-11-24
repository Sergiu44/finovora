-- Remove ONLY_FULL_GROUP_BY from sql_mode
-- This is to allow group by clause to be used without having to specify all columns in the select clause
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
