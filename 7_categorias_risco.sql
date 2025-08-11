-- Sintaxe para criar ou substituir uma consulta salva (procedimento)
CREATE OR REPLACE PROCEDURE `rj-sms-sandbox.sub_pav_us.proced_7_categorias_risco`()

BEGIN

  -- A consulta que você quer salvar e reutilizar


-- {{
--     config(
--         enabled=true,
--         alias="categorias_risco_desconcatenadas",
--     )
-- }}

CREATE OR REPLACE TABLE `rj-sms-sandbox.sub_pav_us._categorias_risco` AS

WITH riscos_separados AS (
  SELECT 
    id_gestacao,
    TRIM(risco) AS categoria_risco
--  FROM {{ ref('mart_bi_gestacoes__linha_tempo') }},
 FROM `rj-sms-sandbox.sub_pav_us._linha_tempo`, 
    UNNEST(SPLIT(categorias_risco, ';')) AS risco
  WHERE 
    TRIM(risco) != ''  -- Remove entradas vazias
)

SELECT 
  id_gestacao,
  categoria_risco
FROM 
  riscos_separados
WHERE 
  categoria_risco IS NOT NULL;

end;