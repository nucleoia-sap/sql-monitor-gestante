 - Regra AAS:

 *Alto risco(um marcador):

   - História de preeclampsia
     -  Pegar da tabela rj-sms.brutos_prontuario_vitacare_historico.pre_natal where agraval_risco_prenatal_histo_obstet_anterior = 'Pré-eclampsia/Eclampsia'

   - Gestacao multipla
     - gravidez_gemelar_cat =1
     - Pegar da tabela rj-sms.brutos_prontuario_vitacare_historico.pre_natal where agraval_risco_prenatal_gravidez_actual = 'Gravidez múltipla'

   - Obesidade (IMC>30)
     -  
     -- CTE para Obesidade (IMC > 30)
    obesidade_gestante AS (
      SELECT
        f.id_gestacao,
        MAX(CASE
          WHEN (fapn.peso / POWER(fapn.altura/100, 2)) > 30 THEN 1
          ELSE 0
        END) AS tem_obesidade
      FROM filtrado f
      LEFT JOIN {{ ref('mart_bi_gestacoes__atendimentos_prenatal_aps') }} fapn
        ON f.id_gestacao = fapn.id_gestacao
      WHERE fapn.peso IS NOT NULL
        AND fapn.altura IS NOT NULL
        AND fapn.altura > 0
      GROUP BY f.id_gestacao
    ),

   - Hipertensão arterial crônica
     - Cid de hipertensão arterial ou provavel_hipertensa_sem_diagnostico = 1 ou
     - Select distinct agraval_risco_prenatal_gravidez_actual da tabela rj-sms.brutos_prontuario_vitacare_historico.pre_natal:
          Hipertensão
   - Diabetes tipo 1 ou 2;
     - Cid de diabetes tipo 1 ou 2 ou tem_antidiabetico = 1
   - Doença renal;
     - doenca_renal_cat = 1
   - Doenças autoimunes (LES, síndrome antifosfolípide);
     - Cid de LES ou síndrome antifosfolípide
   - Gestação decorrente de reprodução assistida.
     - ('Z312', 'Z313', 'Z318', 'Z319')  -- CIDs de reprodução assistida


 *Risco moderado(dois marcadores):
    -Nuliparidade
     -Pegar da tabela (rj-sms.brutos_prontuario_vitacare_historico.pre_natal).tsv coluna agraval_risco_prenatal_histo_reprod = 'Paridade 0'
    -História familiar de preeclampsia (mãe/irmã)
    - tb agraval_risco_prenatal Eclampsia/Pre
    -Idade >= 35 anos
    - Gravidez prévia com desfecho adverso (DPP; baixo peso ao nascer a partir de 37 semanas; trabalho de parto prematuro);
    - Intervalo > 10 anos desde a última gestação.










