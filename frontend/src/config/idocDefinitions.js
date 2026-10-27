// Definições dos segmentos IDOC baseadas no TF.Integration.Datasource.SAP3vFinal.xml
// Posição 0 no XML corresponde à posição 64 no IDOC (após o header do segmento)

export const SEGMENT_DEFINITIONS = {
    "EDI_DC40": {
        description: "Control Record - Header do IDOC (Linha Fixa - Não Editável)",
        dataOffset: 10, // EDI_DC40 tem offset diferente
        isFixedHeader: true, // Marca como header fixo que não será editado
        fields: []
    },
    "ZKFBC_NFSE_NFSE000": {
        description: "NFSe - Nota Fiscal de Serviço",
        dataOffset: 63,
        fields: [
            { name: "DOCNUM", description: "Nº documento", length: 20, position: 0 }
        ]
    },
    "ZKFBC_NFSE_INFNFSE000": {
        description: "Inf NFSe - Informações da NFSe",
        dataOffset: 63,
        fields: [
            { name: "NUMERO", alias: "Numero", description: "Número da NFS-e, formado pelo ano com 4 dig. e num com 11", length: 15, position: 0 },
            { name: "CODIGOVERIFICACAO", alias: "CodigoVerificacao", description: "Código de Verificação da NFSe", length: 9, position: 15 },
            { name: "DATAEMISSAO", alias: "DataEmissao", description: "Data de emissão", length: 19, position: 24 },
            { name: "DATAEMISSAORPS", alias: "DataEmissaoRps", description: "Data de emissão RPS", length: 19, position: 43 },
            { name: "NATUREZAOPERACAO", alias: "NaturezaOperacao", description: "Natureza da Operação", length: 1, position: 62 },
            { name: "REGIMEESPECIALTRIBUTACAO", alias: "RegimeEspecialTributacao", description: "Regime de tributação", length: 1, position: 63 },
            { name: "OPTANTESIMPLESNACIONAL", alias: "OptanteSimplesNacional", description: "Sim/Não", length: 1, position: 64 },
            { name: "INCENTIVADORCULTURAL", alias: "IncentivadorCultural", description: "Sim/Não", length: 1, position: 65 },
            { name: "COMPETENCIA", alias: "Competencia", description: "Data de emissão", length: 19, position: 66 },
            { name: "NFSESUBSTITUIDA", alias: "NfseSubstituida", description: "Número da NFS-e substituída", length: 15, position: 85 },
            { name: "OUTRASINFORMACOES", alias: "OutrasInformacoes", description: "Outras Informações", length: 255, position: 100 },
            { name: "VALORCREDITO", alias: "ValorCredito", description: "Valor", length: 18, position: 355 },
            { name: "NATUREZAOPERACAO2", alias: "NaturezaOperacao2", description: "Campo de 3 bytes de comprimento", length: 3, position: 373 },
            { name: "INCENTIVOFISCAL", alias: "INCENTIVOFISCAL", description: "Código de uma posição", length: 1, position: 376 },
            { name: "EXIGIBILIDADEISS", alias: "EXIGIBILIDADEISS", description: "Código de uma posição", length: 1, position: 377 }
        ]
    },
    "ZKFBC_NFSE_IDENTIFICACAORPS000": {
        description: "Identificação do RPS",
        dataOffset: 63,
        fields: [
            { name: "NUMERO", alias: "Numero", description: "Número RPS", length: 15, position: 0 },
            { name: "SERIE", alias: "Serie", description: "Série RPS", length: 5, position: 15 },
            { name: "TIPO", alias: "Tipo", description: "Tipo de RPS", length: 1, position: 20 }
        ]
    },
    "ZKFBC_NFSE_SERVICO000": {
        description: "Serviços",
        dataOffset: 63,
        fields: [
            { name: "ITEMLISTASERVICO", alias: "ItemListaServico", description: "Item da Lista de Serviço", length: 5, position: 0 },
            { name: "CODIGOCNAE", alias: "CodigoCnae", description: "Número CNAE", length: 7, position: 5 },
            { name: "CODIGOTRIBUTACAOMUNICIPIO", alias: "CodigoTributacaoMunicipio", description: "Código da Tributação", length: 20, position: 12 },
            { name: "CODIGOMUNICIPIO", alias: "CodigoMunicipio", description: "Código do IBGE", length: 7, position: 32 },
            { name: "ITEM", description: "Nº do item do IDoc no IDoc", length: 6, position: 39 },
            { name: "CODIGOCNAE9", alias: "CodigoCnae9", description: "Campo alfanumérico de 9 caracteres", length: 9, position: 45 },
            { name: "CTRIBNAC", alias: "CTRIBNAC", description: "Campo de caracteres de comprimento 6", length: 6, position: 54 },
            { name: "CTRIBMUN", alias: "CTRIBMUN", description: "Campo de caracteres de comprimento 6", length: 9, position: 60 },
            { name: "CNBS", alias: "CNBS", description: "Campo alfanumérico de 9 caracteres", length: 20, position: 69 },
            { name: "CINTCONTRIB", alias: "CINTCONTRIB", description: "Char 20", length: 20, position: 89 }
        ]
    },
    "ZKFBC_NFSE_VALORES000": {
        description: "Valores dos Serviços",
        dataOffset: 63,
        fields: [
            { name: "VALORSERVICOS", alias: "ValorServicos", description: "Valor", length: 18, position: 0 },
            { name: "VALORDEDUCOES", alias: "ValorDeducoes", description: "Valor", length: 18, position: 18 },
            { name: "VALORPIS", alias: "ValorPis", description: "Valor", length: 18, position: 36 },
            { name: "VALORCOFINS", alias: "ValorCofins", description: "Valor", length: 18, position: 54 },
            { name: "VALORINSS", alias: "ValorInss", description: "Valor", length: 18, position: 72 },
            { name: "VALORIR", alias: "ValorIr", description: "Valor", length: 18, position: 90 },
            { name: "VALORCSLL", alias: "ValorCsll", description: "Valor", length: 18, position: 108 },
            { name: "ISSRETIDO", alias: "IssRetido", description: "Sim/Não", length: 1, position: 126 },
            { name: "VALORISS", alias: "ValorIss", description: "Valor", length: 18, position: 127 },
            { name: "VALORISSRETIDO", alias: "ValorIssRetido", description: "Valor", length: 18, position: 145 },
            { name: "OUTRASRETENCOES", alias: "OutrasRetencoes", description: "Valor", length: 18, position: 163 },
            { name: "BASECALCULO", alias: "BaseCalculo", description: "Valor", length: 18, position: 181 },
            { name: "ALIQUOTA", alias: "Aliquota", description: "Alíquota", length: 10, position: 199 },
            { name: "VALORLIQUIDONFSE", alias: "ValorLiquidoNfse", description: "Valor", length: 18, position: 209 },
            { name: "DESCONTOINCONDICIONADO", alias: "DescontoIncondicionado", description: "Valor", length: 18, position: 227 },
            { name: "DESCONTOCONDICIONADO", alias: "DescontoCondicionado", description: "Valor", length: 18, position: 245 },
            { name: "ITEM", description: "Nº do item do IDoc no IDoc", length: 6, position: 263 },
            { name: "TRIBUTACAO", alias: "TRIBUTACAO", description: "Tributação(ISS)", length: 10, position: 269 },
            { name: "VRECEB", alias: "VRECEB", description: "30 caracteres", length: 30, position: 279 },
            { name: "VDESCCOND", alias: "VDESCCOND", description: "30 caracteres", length: 30, position: 309 },
            { name: "PDR", alias: "PDR", description: "Campo de caracteres do comprimento 10", length: 10, position: 339 },
            { name: "VDR", alias: "VDR", description: "30 caracteres", length: 30, position: 349 }
        ]
    },
    "ZKFBC_NFSE_VALORES_RRR_D000": {
        description: "Valores RRR D",
        dataOffset: 63,
        fields: [
            { name: "DTEMIDOC", alias: "DTEMIDOC", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "DTCOMPDOC", alias: "DTCOMPDOC", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "TPREEREPRES", alias: "TPREEREPRES", description: "Componente do nº versão", length: 2, position: 20 },
            { name: "XTPREEREPRES", alias: "XTPREEREPRES", description: "XTPREEREPRES", length: 150, position: 22 },
            { name: "VLRREEREPRES", alias: "VLRREEREPRES", description: "30 caracteres", length: 30, position: 172 }
        ]
    },
    "ZKFBC_NFSE_VALORES_RRR_D_FO000": {
        description: "Valores RRR D FO",
        dataOffset: 63,
        fields: [
            { name: "CMUNDOCFISCAL", alias: "CMUNDOCFISCAL", description: "Campo de caractere de comprimento 7", length: 7, position: 0 },
            { name: "NDOCFISCAL", alias: "NDOCFISCAL", description: "char255", length: 255, position: 7 },
            { name: "XDOCFISCAL", alias: "XDOCFISCAL", description: "char255", length: 255, position: 262 }
        ]
    },
    "ZKFBC_NFSE_VALORES_RRR_D_O000": {
        description: "Valores RRR D O",
        dataOffset: 63,
        fields: [
            { name: "NDOC", alias: "NDOC", description: "char255", length: 255, position: 0 },
            { name: "XDOC", alias: "XDOC", description: "char255", length: 255, position: 255 }
        ]
    },
    "ZKFBC_NFSE_VALORES_RRR_D_N000": {
        description: "Valores RRR D N",
        dataOffset: 63,
        fields: [
            { name: "TIPOCHAVEDFE", alias: "TIPOCHAVEDFE", description: "Código de uma posição", length: 1, position: 0 },
            { name: "XTIPOCHAVEDFE", alias: "XTIPOCHAVEDFE", description: "char255", length: 255, position: 1 },
            { name: "CHAVEDFE", alias: "CHAVEDFE", description: "Comentário", length: 50, position: 256 }
        ]
    },
    "ZKFBC_NFSE_VALORES_RRR_D_F000": {
        description: "Valores RRR D F",
        dataOffset: 63,
        fields: [
            { name: "CNPJ", alias: "CNPJ", description: "CNPJ", length: 14, position: 0 },
            { name: "CPF", alias: "CPF", description: "CPF", length: 11, position: 14 },
            { name: "NIF", alias: "NIF", description: "NIF", length: 40, position: 25 },
            { name: "CNAONIF", alias: "CNAONIF", description: "CNAONIF", length: 1, position: 65 },
            { name: "XNOME", alias: "XNOME", description: "XNOME", length: 150, position: 66 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TT000": {
        description: "Valores T TT - Tributos Totais",
        dataOffset: 63,
        fields: [
            { name: "INDTOTTRIB", alias: "INDTOTTRIB", description: "Código de uma posição", length: 1, position: 0 },
            { name: "PTOTTRIBSN", alias: "PTOTTRIBSN", description: "Campo de caracteres do comprimento 10", length: 10, position: 1 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TT_P000": {
        description: "Valores T TT P - Percentuais",
        dataOffset: 63,
        fields: [
            { name: "PTOTTRIBFED", alias: "PTOTTRIBFED", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "PTOTTRIBEST", alias: "PTOTTRIBEST", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "PTOTTRIBMUN", alias: "PTOTTRIBMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 20 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TT_V000": {
        description: "Valores T TT V - Valores Tributos",
        dataOffset: 63,
        fields: [
            { name: "VTOTTRIBFED", alias: "VTOTTRIBFED", description: "30 caracteres", length: 30, position: 0 },
            { name: "VTOTTRIBEST", alias: "VTOTTRIBEST", description: "30 caracteres", length: 30, position: 30 },
            { name: "VTOTTRIBMUN", alias: "VTOTTRIBMUN", description: "30 caracteres", length: 30, position: 60 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TF000": {
        description: "Valores T TF - Tributos Federais",
        dataOffset: 63,
        fields: [
            { name: "VRETCP", alias: "VRETCP", description: "30 caracteres", length: 30, position: 0 },
            { name: "VRETIRRF", alias: "VRETIRRF", description: "30 caracteres", length: 30, position: 30 },
            { name: "VRETCSLL", alias: "VRETCSLL", description: "30 caracteres", length: 30, position: 60 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TF_PC000": {
        description: "Valores T TF PC - PIS/COFINS",
        dataOffset: 63,
        fields: [
            { name: "CST", alias: "CST", description: "Componente do nº versão", length: 2, position: 0 },
            { name: "VBCPISCOFINS", alias: "VBCPISCOFINS", description: "30 caracteres", length: 30, position: 2 },
            { name: "PALIQPIS", alias: "PALIQPIS", description: "Campo de caracteres do comprimento 10", length: 10, position: 32 },
            { name: "PALIQCOFINS", alias: "PALIQCOFINS", description: "Campo de caracteres do comprimento 10", length: 10, position: 42 },
            { name: "VPIS", alias: "VPIS", description: "30 caracteres", length: 30, position: 52 },
            { name: "VCOFINS", alias: "VCOFINS", description: "30 caracteres", length: 30, position: 82 },
            { name: "TPRETPISCOFINS", alias: "TPRETPISCOFINS", description: "Código de uma posição", length: 1, position: 112 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TM000": {
        description: "Valores T TM - Tributos Municipais",
        dataOffset: 63,
        fields: [
            { name: "TRIBISSQN", alias: "TRIBISSQN", description: "Código de uma posição", length: 1, position: 0 },
            { name: "CPAISRESULT", alias: "CPAISRESULT", description: "Componente do nº versão", length: 2, position: 1 },
            { name: "TPIMUNIDADE", alias: "TPIMUNIDADE", description: "Código de uma posição", length: 1, position: 3 },
            { name: "PALIQ", alias: "PALIQ", description: "Campo de caracteres do comprimento 10", length: 10, position: 4 },
            { name: "TPRETISSQN", alias: "TPRETISSQN", description: "Código de uma posição", length: 1, position: 14 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TM_ES000": {
        description: "Valores T TM ES - Exigibilidade Suspensa",
        dataOffset: 63,
        fields: [
            { name: "TPSUSP", alias: "TPSUSP", description: "Código de uma posição", length: 1, position: 0 },
            { name: "NPROCESSO", alias: "NPROCESSO", description: "30 caracteres", length: 30, position: 1 }
        ]
    },
    "ZKFBC_NFSE_VALORES_T_TM_BM000": {
        description: "Valores T TM BM - Benefício Municipal",
        dataOffset: 63,
        fields: [
            { name: "NBM", alias: "NBM", description: "Campo de texto (comprimento 14)", length: 14, position: 0 },
            { name: "VREDBCBM", alias: "VREDBCBM", description: "30 caracteres", length: 30, position: 14 },
            { name: "PREDBCBM", alias: "PREDBCBM", description: "30 caracteres", length: 30, position: 44 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_D000": {
        description: "Valores VDR D - Deduções/Reduções",
        dataOffset: 63,
        fields: [
            { name: "NNFSEMUN", alias: "NNFSEMUN", description: "Caractere 15", length: 15, position: 0 },
            { name: "CVERIFNFSEMUN", alias: "CVERIFNFSEMUN", description: "Campo alfanumérico de 9 caracteres", length: 9, position: 15 },
            { name: "NDOCFISC", alias: "NDOCFISC", description: "char255", length: 255, position: 24 },
            { name: "NDOC", alias: "NDOC", description: "char255", length: 255, position: 279 },
            { name: "TPDEDRED", alias: "TPDEDRED", description: "Componente do nº versão", length: 2, position: 534 },
            { name: "XDESCOUTDED", alias: "XDESCOUTDED", description: "XDESCOUTDED", length: 150, position: 536 },
            { name: "DTEMIDOC", alias: "DTEMIDOC", description: "Campo de caracteres do comprimento 10", length: 10, position: 686 },
            { name: "VDEDUTIVELREDUTIVEL", alias: "VDEDUTIVELREDUTIVEL", description: "Valor", length: 18, position: 696 },
            { name: "VDEDUCAOREDUCAO", alias: "VDEDUCAOREDUCAO", description: "Valor", length: 18, position: 714 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_F000": {
        description: "Valores VDR F - Fornecedor",
        dataOffset: 63,
        fields: [
            { name: "CNPJ", alias: "CNPJ", description: "CNPJ", length: 14, position: 0 },
            { name: "CPF", alias: "CPF", description: "CPF", length: 11, position: 14 },
            { name: "NIF", alias: "NIF", description: "NIF", length: 40, position: 25 },
            { name: "CNAONIF", alias: "CNAONIF", description: "CNAONIF", length: 1, position: 65 },
            { name: "CAEPF", alias: "CAEPF", description: "CAEPF", length: 14, position: 66 },
            { name: "IM", alias: "IM", description: "IM", length: 15, position: 80 },
            { name: "XNOME", alias: "XNOME", description: "XNOME", length: 150, position: 95 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_F_E000": {
        description: "Valores VDR F E - Endereço",
        dataOffset: 63,
        fields: [
            { name: "XLGR", alias: "XLGR", description: "XLGR", length: 255, position: 0 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 255 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 315 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 471 },
            { name: "FONE", alias: "FONE", description: "FONE", length: 20, position: 531 },
            { name: "EMAIL", alias: "EMAIL", description: "Email", length: 80, position: 551 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_F_EE000": {
        description: "Valores VDR F EE - Endereço Exterior",
        dataOffset: 63,
        fields: [
            { name: "CPAIS", alias: "CPAIS", description: "CPAIS", length: 2, position: 0 },
            { name: "CENDPOST", alias: "CENDPOST", description: "CENDPOST", length: 11, position: 2 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 13 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 73 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_F_EN000": {
        description: "Valores VDR F EN - Endereço Nacional",
        dataOffset: 63,
        fields: [
            { name: "CMUN", alias: "CMUN", description: "CMUN", length: 7, position: 0 },
            { name: "CEP", alias: "CEP", description: "CEP", length: 8, position: 7 }
        ]
    },
    "ZKFBC_NFSE_VALORES_VDR_D_NE000": {
        description: "Valores VDR D NE - NFSe/NFe",
        dataOffset: 63,
        fields: [
            { name: "CHNFSE", alias: "CHNFSE", description: "Comentário", length: 50, position: 0 },
            { name: "CHNFE", alias: "CHNFE", description: "Categoria de dados numérica char 44", length: 44, position: 50 },
            { name: "CMUNNFSEMUN", alias: "CMUNNFSEMUN", description: "Campo de caractere de comprimento 7", length: 7, position: 94 }
        ]
    },
    "ZKFBC_NFSE_VALORES_ISSQN000": {
        description: "Valores ISSQN",
        dataOffset: 63,
        fields: [
            { name: "VCALCDR", alias: "VCALCDR", description: "30 caracteres", length: 30, position: 0 },
            { name: "TPBM", alias: "TPBM", description: "Character field of length 40", length: 40, position: 30 },
            { name: "VCALCBM", alias: "VCALCBM", description: "30 caracteres", length: 30, position: 70 },
            { name: "VBC", alias: "VBC", description: "30 caracteres", length: 30, position: 100 },
            { name: "PALIQAPLIC", alias: "PALIQAPLIC", description: "Campo de caracteres do comprimento 10", length: 10, position: 130 },
            { name: "VISSQN", alias: "VISSQN", description: "30 caracteres", length: 30, position: 140 },
            { name: "VTOTALRET", alias: "VTOTALRET", description: "30 caracteres", length: 30, position: 170 },
            { name: "VLIQ", alias: "VLIQ", description: "30 caracteres", length: 30, position: 200 },
            { name: "XOUTINF", alias: "XOUTINF", description: "char255", length: 255, position: 230 }
        ]
    },
    "ZKFBC_NFSE_DISCRIMINACAO000": {
        description: "Discriminação do Serviço",
        dataOffset: 63,
        fields: [
            { name: "DISCRIM", alias: "Discriminacao", description: "Descrição", length: 994, position: 0 },
            { name: "ITEM", description: "Nº do item do IDoc no IDoc", length: 6, position: 994 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_INFOCOMP000": {
        description: "Informações Complementares do Serviço",
        dataOffset: 63,
        fields: [
            { name: "IDDOCTEC", alias: "IDDOCTEC", description: "Character field of length 40", length: 40, position: 0 },
            { name: "DOCREF", alias: "DOCREF", description: "char255", length: 255, position: 40 },
            { name: "XPED", alias: "XPED", description: "XPED", length: 60, position: 295 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_IC_IC000": {
        description: "Informações Complementares IC",
        dataOffset: 63,
        fields: [
            { name: "XINFCOMP", alias: "XINFCOMP", description: "XINFCOMP", length: 1000, position: 0 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_IC_IP000": {
        description: "Informações Complementares IP",
        dataOffset: 63,
        fields: [
            { name: "XITEMPED", alias: "XITEMPED", description: "XPED", length: 60, position: 0 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_AE000": {
        description: "Atividade/Evento",
        dataOffset: 63,
        fields: [
            { name: "XNOME", alias: "XNOME", description: "char255", length: 255, position: 0 },
            { name: "DTINI", alias: "DTINI", description: "Campo de caracteres do comprimento 10", length: 10, position: 255 },
            { name: "DTFIM", alias: "DTFIM", description: "Campo de caracteres do comprimento 10", length: 10, position: 265 },
            { name: "IDATVEVT", alias: "IDATVEVT", description: "30 caracteres", length: 30, position: 275 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_AE_END000": {
        description: "Endereço Atividade/Evento",
        dataOffset: 63,
        fields: [
            { name: "CEP", alias: "CEP", description: "CEP", length: 8, position: 0 },
            { name: "CENDPOST", alias: "CENDPOST", description: "CENDPOST", length: 11, position: 8 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 19 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 79 },
            { name: "XLGR", alias: "XLGR", description: "XLGR", length: 255, position: 139 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 394 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 454 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 610 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_OBRA000": {
        description: "Obra",
        dataOffset: 63,
        fields: [
            { name: "INSCIMOBFISC", alias: "INSCIMOBFISC", description: "30 caracteres", length: 30, position: 0 },
            { name: "COBRA", alias: "COBRA", description: "30 caracteres", length: 30, position: 30 },
            { name: "CCIB", alias: "CCIB", description: "Campo de caracteres do comprimento 8", length: 8, position: 60 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_OBRA_END000": {
        description: "Endereço da Obra",
        dataOffset: 63,
        fields: [
            { name: "CEP", alias: "CEP", description: "CEP", length: 8, position: 0 },
            { name: "CENDPOST", alias: "CENDPOST", description: "CENDPOST", length: 11, position: 8 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 19 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 79 },
            { name: "XLGR", alias: "XLGR", description: "XLGR", length: 255, position: 139 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 394 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 454 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 610 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_LSADPPU000": {
        description: "Local de Serviço ADPPU",
        dataOffset: 63,
        fields: [
            { name: "CATEG", alias: "CATEG", description: "Código de uma posição", length: 1, position: 0 },
            { name: "OBJETO", alias: "OBJETO", description: "Código de uma posição", length: 1, position: 1 },
            { name: "EXTENSAO", alias: "EXTENSAO", description: "Tabela R/2", length: 5, position: 2 },
            { name: "NPOSTES", alias: "NPOSTES", description: "Campo de caracteres de comprimento 6", length: 6, position: 7 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_LP000": {
        description: "Local de Prestação",
        dataOffset: 63,
        fields: [
            { name: "CLOCPRESTACAO", alias: "CLOCPRESTACAO", description: "Campo de caractere de comprimento 7", length: 7, position: 0 },
            { name: "CPAISPRESTACAO", alias: "CPAISPRESTACAO", description: "Componente do nº versão", length: 2, position: 7 }
        ]
    },
    "ZKFBC_NFSE_SERVICO_COMEXT000": {
        description: "Comércio Exterior",
        dataOffset: 63,
        fields: [
            { name: "MDPRESTACAO", alias: "MDPRESTACAO", description: "Código de uma posição", length: 1, position: 0 },
            { name: "VINCPREST", alias: "VINCPREST", description: "Código de uma posição", length: 1, position: 1 },
            { name: "TPMOEDA", alias: "TPMOEDA", description: "Campo de 3 bytes de comprimento", length: 3, position: 2 },
            { name: "VSERVMOEDA", alias: "VSERVMOEDA", description: "Campo de comprimento 18", length: 18, position: 5 },
            { name: "MECAFCOMEXP", alias: "MECAFCOMEXP", description: "Componente do nº versão", length: 2, position: 23 },
            { name: "MECAFCOMEXT", alias: "MECAFCOMEXT", description: "Componente do nº versão", length: 2, position: 25 },
            { name: "MOVTEMPBENS", alias: "MOVTEMPBENS", description: "Código de uma posição", length: 1, position: 27 },
            { name: "NDI", alias: "NDI", description: "Campo de texto de comprimento 12", length: 12, position: 28 },
            { name: "NRE", alias: "NRE", description: "Campo de texto de comprimento 12", length: 12, position: 40 },
            { name: "MDIC", alias: "MDIC", description: "Código de uma posição", length: 1, position: 52 }
        ]
    },
    "ZKFBC_NFSE_PRESTADORSERVICO000": {
        description: "Prestador do Serviço",
        dataOffset: 63,
        fields: [
            { name: "CNPJ", alias: "Cnpj", description: "CNPJ", length: 14, position: 0 },
            { name: "INSCRICAOMUNICIPAL", alias: "InscricaoMunicipal", description: "Inscrição Municipal", length: 15, position: 14 },
            { name: "RAZAOSOCIAL", alias: "RazaoSocial", description: "Razão Social", length: 115, position: 29 },
            { name: "NOMEFANTASIA", alias: "NomeFantasia", description: "Nome Fantasia", length: 60, position: 144 },
            { name: "ENDERECO", alias: "Endereco", description: "Endereço", length: 125, position: 204 },
            { name: "NUMERO", alias: "Numero", description: "Número do Endereço", length: 10, position: 329 },
            { name: "COMPLEMENTO", alias: "Complemento", description: "Complemento do Endereço", length: 60, position: 339 },
            { name: "BAIRRO", alias: "Bairro", description: "Bairro", length: 60, position: 399 },
            { name: "CODIGOMUNICIPIO", alias: "CodigoMunicipio", description: "Código do IBGE", length: 7, position: 459 },
            { name: "UF", alias: "Uf", description: "UF", length: 2, position: 466 },
            { name: "CEP", alias: "Cep", description: "CEP", length: 8, position: 468 },
            { name: "TELEFONE", alias: "Telefone", description: "Telefone", length: 11, position: 476 },
            { name: "EMAIL", alias: "Email", description: "Email", length: 80, position: 487 },
            { name: "CPF", alias: "CPF", description: "Caractere comprimento 11", length: 11, position: 567 },
            { name: "NIF", alias: "NIF", description: "Character field of length 40", length: 40, position: 578 },
            { name: "CNAONIF", alias: "CNAONIF", description: "Código de uma posição", length: 1, position: 618 },
            { name: "CAEPF", alias: "CAEPF", description: "Campo de texto (comprimento 14)", length: 14, position: 619 },
            { name: "CPAIS", alias: "CPAIS", description: "Componente do nº versão", length: 2, position: 633 },
            { name: "CENDPOST", alias: "CENDPOST", description: "Caractere comprimento 11", length: 11, position: 635 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 646 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 706 }
        ]
    },
    "ZKFBC_NFSE_PS_REGTRIB000": {
        description: "Regime Tributário do Prestador",
        dataOffset: 63,
        fields: [
            { name: "OPSIMPNAC", alias: "OPSIMPNAC", description: "Código de uma posição", length: 1, position: 0 },
            { name: "REGAPTRIBSN", alias: "REGAPTRIBSN", description: "Código de uma posição", length: 1, position: 1 },
            { name: "REGESPTRIB", alias: "REGESPTRIB", description: "Código de uma posição", length: 1, position: 2 }
        ]
    },
    "ZKFBC_NFSE_TOMADORSERVICO000": {
        description: "Tomador do Serviço",
        dataOffset: 63,
        fields: [
            { name: "CPF", alias: "Cpf", description: "CPF", length: 11, position: 0 },
            { name: "CNPJ", alias: "Cnpj", description: "CNPJ", length: 14, position: 11 },
            { name: "INSCRICAOMUNICIPAL", alias: "InscricaoMunicipal", description: "Inscrição Municipal", length: 15, position: 25 },
            { name: "RAZAOSOCIAL", alias: "RazaoSocial", description: "Razão Social", length: 115, position: 40 },
            { name: "NOMEFANTASIA", alias: "NomeFantasia", description: "Nome Fantasia", length: 60, position: 155 },
            { name: "ENDERECO", alias: "Endereco", description: "Endereço", length: 125, position: 215 },
            { name: "NUMERO", alias: "Numero", description: "Número do Endereço", length: 10, position: 340 },
            { name: "COMPLEMENTO", alias: "Complemento", description: "Complemento do Endereço", length: 60, position: 350 },
            { name: "BAIRRO", alias: "Bairro", description: "Bairro", length: 60, position: 410 },
            { name: "CODIGOMUNICIPIO", alias: "CodigoMunicipio", description: "Código do IBGE", length: 7, position: 470 },
            { name: "UF", alias: "Uf", description: "UF", length: 2, position: 477 },
            { name: "CEP", alias: "Cep", description: "CEP", length: 8, position: 479 },
            { name: "TELEFONE", alias: "Telefone", description: "Telefone", length: 11, position: 487 },
            { name: "EMAIL", alias: "Email", description: "Email", length: 80, position: 498 },
            { name: "NIF", alias: "NIF", description: "Character field of length 40", length: 40, position: 578 },
            { name: "CNAONIF", alias: "CNAONIF", description: "Código de uma posição", length: 1, position: 618 },
            { name: "CAEPF", alias: "CAEPF", description: "Campo de texto (comprimento 14)", length: 14, position: 619 },
            { name: "CPAIS", alias: "CPAIS", description: "Componente do nº versão", length: 2, position: 633 },
            { name: "CENDPOST", alias: "CENDPOST", description: "Caractere comprimento 11", length: 11, position: 635 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 646 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 706 }
        ]
    },
    "ZKFBC_NFSE_INTERMEDIARIOSER000": {
        description: "Intermediário do Serviço",
        dataOffset: 63,
        fields: [
            { name: "RAZAOSOCIAL", alias: "RazaoSocial", description: "Razão Social", length: 115, position: 0 },
            { name: "CPF", alias: "Cpf", description: "CPF", length: 11, position: 115 },
            { name: "CNPJ", alias: "Cnpj", description: "CNPJ", length: 14, position: 126 },
            { name: "INSCRICAOMUNICIPAL", alias: "InscricaoMunicipal", description: "Inscrição Municipal", length: 15, position: 140 },
            { name: "NIF", alias: "NIF", description: "Character field of length 40", length: 40, position: 155 },
            { name: "CNAONIF", alias: "CNAONIF", description: "Código de uma posição", length: 1, position: 195 },
            { name: "CAEPF", alias: "CAEPF", description: "Campo de texto (comprimento 14)", length: 14, position: 196 },
            { name: "CMUN", alias: "CMUN", description: "Campo de caractere de comprimento 7", length: 7, position: 210 },
            { name: "CEP", alias: "CEP", description: "Campo de caracteres do comprimento 8", length: 8, position: 217 },
            { name: "CPAIS", alias: "CPAIS", description: "Componente do nº versão", length: 2, position: 225 },
            { name: "CENDPOST", alias: "CENDPOST", description: "Caractere comprimento 11", length: 11, position: 227 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 238 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 298 },
            { name: "XLGR", alias: "XLGR", description: "char255", length: 255, position: 358 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 613 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 673 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "Bairro", length: 60, position: 829 },
            { name: "FONE", alias: "FONE", description: "Char 20", length: 20, position: 889 },
            { name: "EMAIL", alias: "EMAIL", description: "Char 80", length: 80, position: 909 }
        ]
    },
    "ZKFBC_NFSE_ORGAOGERADOR000": {
        description: "Órgão Gerador",
        dataOffset: 63,
        fields: [
            { name: "CODIGOMUNICIPIO", alias: "CodigoMunicipio", description: "Código do IBGE", length: 7, position: 0 },
            { name: "UF", alias: "Uf", description: "UF", length: 2, position: 7 }
        ]
    },
    "ZKFBC_NFSE_CONSTRUCAOCIVIL000": {
        description: "Construção Civil",
        dataOffset: 63,
        fields: [
            { name: "CODIGOOBRA", alias: "CodigoObra", description: "Código da Obra", length: 15, position: 0 },
            { name: "ART", alias: "Art", description: "Art", length: 15, position: 15 }
        ]
    },
    "ZKFBC_NFSE_EMIT000": {
        description: "Emitente",
        dataOffset: 63,
        fields: [
            { name: "CNPJ", alias: "CNPJ", description: "Campo de texto (comprimento 14)", length: 14, position: 0 },
            { name: "CPF", alias: "CPF", description: "Caractere comprimento 11", length: 11, position: 14 },
            { name: "IM", alias: "IM", description: "Caractere 15", length: 15, position: 25 },
            { name: "XNOME", alias: "XNOME", description: "XNOME", length: 150, position: 40 },
            { name: "XFANT", alias: "XFANT", description: "XFANT", length: 150, position: 190 },
            { name: "FONE", alias: "FONE", description: "Char 20", length: 20, position: 340 },
            { name: "EMAIL", alias: "EMAIL", description: "Char 80", length: 80, position: 360 }
        ]
    },
    "ZKFBC_NFSE_EMIT_ENDERNAC000": {
        description: "Endereço Nacional do Emitente",
        dataOffset: 63,
        fields: [
            { name: "XLGR", alias: "XLGR", description: "char255", length: 255, position: 0 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 255 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 315 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 471 },
            { name: "CMUN", alias: "CMUN", description: "Campo de caractere de comprimento 7", length: 7, position: 531 },
            { name: "UF", alias: "UF", description: "Componente do nº versão", length: 2, position: 538 },
            { name: "CEP", alias: "CEP", description: "Campo de caracteres do comprimento 8", length: 8, position: 540 }
        ]
    },
    "ZKFBC_NFSE_INFNFSE_N000": {
        description: "Informações NFSe N",
        dataOffset: 63,
        fields: [
            { name: "CLOCINCID", alias: "CLOCINCID", description: "Campo de caractere de comprimento 7", length: 7, position: 0 },
            { name: "XLOCINCID", alias: "XLOCINCID", description: "xLocIncid", length: 150, position: 7 },
            { name: "XTRIBNAC", alias: "XTRIBNAC", description: "char255", length: 255, position: 157 },
            { name: "XTRIBMUN", alias: "XTRIBMUN", description: "char255", length: 255, position: 412 },
            { name: "XNBS", alias: "XNBS", description: "char255", length: 255, position: 667 },
            { name: "VERAPLIC", alias: "VERAPLIC", description: "Char 20", length: 20, position: 922 },
            { name: "AMBGER", alias: "AMBGER", description: "Código de uma posição", length: 1, position: 942 },
            { name: "TPEMIS", alias: "TPEMIS", description: "Código de uma posição", length: 1, position: 943 },
            { name: "PROCEMI", alias: "PROCEMI", description: "Código de uma posição", length: 1, position: 944 },
            { name: "CSTAT", alias: "CSTAT", description: "Campo de 3 bytes de comprimento", length: 3, position: 945 },
            { name: "DHPROC", alias: "DHPROC", description: "Cadeia de texto - 22 caracteres", length: 22, position: 948 },
            { name: "NDFE", alias: "NDFE", description: "Campo alfanumérico de 13 caracteres", length: 13, position: 970 }
        ]
    },
    "ZKFBC_NFSE_DESTINATARIO000": {
        description: "Destinatário",
        dataOffset: 63,
        fields: [
            { name: "CNPJ", alias: "CNPJ", description: "CNPJ", length: 14, position: 0 },
            { name: "CPF", alias: "CPF", description: "CPF", length: 11, position: 14 },
            { name: "NIF", alias: "NIF", description: "NIF", length: 40, position: 25 },
            { name: "CNAONIF", alias: "CNAONIF", description: "CNAONIF", length: 1, position: 65 },
            { name: "XNOME", alias: "XNOME", description: "XNOME", length: 150, position: 66 },
            { name: "CMUN", alias: "CMUN", description: "CMUN", length: 7, position: 216 },
            { name: "CEP", alias: "CEP", description: "CEP", length: 8, position: 223 },
            { name: "CPAIS", alias: "CPAIS", description: "CPAIS", length: 2, position: 231 },
            { name: "CENDPOST", alias: "CENDPOST", description: "CENDPOST", length: 11, position: 233 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 244 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 304 },
            { name: "XLGR", alias: "XLGR", description: "XLGR", length: 255, position: 364 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 619 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 679 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 835 },
            { name: "FONE", alias: "FONE", description: "FONE", length: 20, position: 895 },
            { name: "EMAIL", alias: "EMAIL", description: "Email", length: 80, position: 915 }
        ]
    },
    "ZKFBC_NFSE_DPS000": {
        description: "DPS",
        dataOffset: 63,
        fields: [
            { name: "VERSAO", alias: "VERSAO", description: "Campo de caractere de comprimento 7", length: 7, position: 0 }
        ]
    },
    "ZKFBC_NFSE_DPS_INFDPS000": {
        description: "Informações DPS",
        dataOffset: 63,
        fields: [
            { name: "ID", alias: "ID", description: "Char45", length: 45, position: 0 },
            { name: "TPAMB", alias: "TPAMB", description: "Código de uma posição", length: 1, position: 45 },
            { name: "DHEMI", alias: "DHEMI", description: "Cadeia de texto - 22 caracteres", length: 22, position: 46 },
            { name: "VERAPLIC", alias: "VERAPLIC", description: "Char 20", length: 20, position: 68 },
            { name: "SERIE", alias: "SERIE", description: "Tabela R/2", length: 5, position: 88 },
            { name: "NDPS", alias: "NDPS", description: "Caractere 15", length: 15, position: 93 },
            { name: "DCOMPET", alias: "DCOMPET", description: "Campo de caracteres do comprimento 10", length: 10, position: 108 },
            { name: "TPEMIT", alias: "TPEMIT", description: "Código de uma posição", length: 1, position: 118 },
            { name: "CMOTIVOEMISTI", alias: "CMOTIVOEMISTI", description: "Código de uma posição", length: 1, position: 119 },
            { name: "CHNFSEREJ", alias: "CHNFSEREJ", description: "Comentário", length: 50, position: 120 },
            { name: "CLOCEMI", alias: "CLOCEMI", description: "Campo de caractere de comprimento 7", length: 7, position: 170 }
        ]
    },
    "ZKFBC_NFSE_DPS_INFDPS_S000": {
        description: "Substituição DPS",
        dataOffset: 63,
        fields: [
            { name: "CHSUBSTDA", alias: "CHSUBSTDA", description: "Comentário", length: 50, position: 0 },
            { name: "CMOTIVO", alias: "CMOTIVO", description: "Código de uma posição", length: 1, position: 50 },
            { name: "XMOTIVO", alias: "XMOTIVO", description: "char255", length: 255, position: 51 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS000": {
        description: "IBS/CBS",
        dataOffset: 63,
        fields: [
            { name: "CLOCALIDADEINCID", alias: "CLOCALIDADEINCID", description: "CLOCALIDADEINCID", length: 7, position: 0 },
            { name: "XLOCALIDADEINCID", alias: "XLOCALIDADEINCID", description: "char255", length: 255, position: 7 },
            { name: "PREDUTOR", alias: "PREDUTOR", description: "Tabela R/2", length: 5, position: 262 },
            { name: "FINNFSE", alias: "FINNFSE", description: "Código de uma posição", length: 1, position: 267 },
            { name: "INDFINAL", alias: "INDFINAL", description: "Código de uma posição", length: 1, position: 268 },
            { name: "CINDOP", alias: "CINDOP", description: "Campo de caracteres de comprimento 6", length: 6, position: 269 },
            { name: "TPENTEGOV", alias: "TPENTEGOV", description: "Código de uma posição", length: 1, position: 275 },
            { name: "INDDEST", alias: "INDDEST", description: "Código de uma posição", length: 1, position: 276 },
            { name: "TPOPER", alias: "TPOPER", description: "Código de uma posição", length: 1, position: 277 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_IM000": {
        description: "IBS/CBS Imóvel",
        dataOffset: 63,
        fields: [
            { name: "INSCIMOBFISC", alias: "INSCIMOBFISC", description: "30 caracteres", length: 30, position: 0 },
            { name: "COBRA", alias: "COBRA", description: "30 caracteres", length: 30, position: 30 },
            { name: "CCIB", alias: "CCIB", description: "Campo de caracteres do comprimento 8", length: 8, position: 60 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_IM_E000": {
        description: "IBS/CBS Imóvel Endereço",
        dataOffset: 63,
        fields: [
            { name: "CEP", alias: "CEP", description: "CEP", length: 8, position: 0 },
            { name: "XLGR", alias: "XLGR", description: "XLGR", length: 255, position: 8 },
            { name: "NRO", alias: "NRO", description: "NRO", length: 60, position: 263 },
            { name: "XCPL", alias: "XCPL", description: "XCPL", length: 156, position: 323 },
            { name: "XBAIRRO", alias: "XBAIRRO", description: "XBAIRRO", length: 60, position: 479 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_IM_E_EX000": {
        description: "IBS/CBS Imóvel Endereço Exterior",
        dataOffset: 63,
        fields: [
            { name: "CENDPOST", alias: "CENDPOST", description: "CENDPOST", length: 11, position: 0 },
            { name: "XCIDADE", alias: "XCIDADE", description: "XCIDADE", length: 60, position: 11 },
            { name: "XESTPROVREG", alias: "XESTPROVREG", description: "XESTPROVREG", length: 60, position: 71 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_REF000": {
        description: "IBS/CBS Referência",
        dataOffset: 63,
        fields: [
            { name: "REFNFSE", alias: "REFNFSE", description: "Comentário", length: 50, position: 0 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT000": {
        description: "IBS/CBS Totais",
        dataOffset: 63,
        fields: [
            { name: "VTOTNF", alias: "VTOTNF", description: "30 caracteres", length: 30, position: 0 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_C_TCG000": {
        description: "IBS/CBS Totais C TCG",
        dataOffset: 63,
        fields: [
            { name: "PIBSUF", alias: "PIBSUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "VIBSUF", alias: "VIBSUF", description: "30 caracteres", length: 30, position: 10 },
            { name: "PIBSMUN", alias: "PIBSMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 40 },
            { name: "VIBSMUN", alias: "VIBSMUN", description: "30 caracteres", length: 30, position: 50 },
            { name: "PCBS", alias: "PCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 80 },
            { name: "VCBS", alias: "VCBS", description: "30 caracteres", length: 30, position: 90 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_C000": {
        description: "IBS/CBS Totais C",
        dataOffset: 63,
        fields: [
            { name: "VDIFCBS", alias: "VDIFCBS", description: "30 caracteres", length: 30, position: 0 },
            { name: "VCBS", alias: "VCBS", description: "30 caracteres", length: 30, position: 30 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_C_TR000": {
        description: "IBS/CBS Totais C TR",
        dataOffset: 63,
        fields: [
            { name: "PALIQEFEREGIBSUF", alias: "PALIQEFEREGIBSUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "VTRIBREGIBSUF", alias: "VTRIBREGIBSUF", description: "30 caracteres", length: 30, position: 10 },
            { name: "PALIQEFEREGIBSMUN", alias: "PALIQEFEREGIBSMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 40 },
            { name: "VTRIBREGIBSMUN", alias: "VTRIBREGIBSMUN", description: "30 caracteres", length: 30, position: 50 },
            { name: "PALIQEFEREGCBS", alias: "PALIQEFEREGCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 80 },
            { name: "VTRIBREGCBS", alias: "VTRIBREGCBS", description: "30 caracteres", length: 30, position: 90 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_C_CP000": {
        description: "IBS/CBS Totais C CP",
        dataOffset: 63,
        fields: [
            { name: "PCREDPRESCBS", alias: "PCREDPRESCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "VCREDPRESCBS", alias: "VCREDPRESCBS", description: "30 caracteres", length: 30, position: 10 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_G000": {
        description: "IBS/CBS Totais G",
        dataOffset: 63,
        fields: [
            { name: "VIBSTOT", alias: "VIBSTOT", description: "30 caracteres", length: 30, position: 0 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_G_MUT000": {
        description: "IBS/CBS Totais G MUT",
        dataOffset: 63,
        fields: [
            { name: "VDIFMUN", alias: "VDIFMUN", description: "30 caracteres", length: 30, position: 0 },
            { name: "VIBSMUN", alias: "VIBSMUN", description: "30 caracteres", length: 30, position: 30 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_G_UFT000": {
        description: "IBS/CBS Totais G UFT",
        dataOffset: 63,
        fields: [
            { name: "VDIFUF", alias: "VDIFUF", description: "30 caracteres", length: 30, position: 0 },
            { name: "VIBSUF", alias: "VIBSUF", description: "30 caracteres", length: 30, position: 30 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_TOT_G_CP000": {
        description: "IBS/CBS Totais G CP",
        dataOffset: 63,
        fields: [
            { name: "PCREDPRESIBS", alias: "PCREDPRESIBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "VCREDPRESIBS", alias: "VCREDPRESIBS", description: "30 caracteres", length: 30, position: 10 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL000": {
        description: "IBS/CBS Valores",
        dataOffset: 63,
        fields: [
            { name: "VBC", alias: "VBC", description: "30 caracteres", length: 30, position: 0 },
            { name: "VCALCREEREPRES", alias: "VCALCREEREPRES", description: "30 caracteres", length: 30, position: 30 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_T_I000": {
        description: "IBS/CBS Valores T I",
        dataOffset: 63,
        fields: [
            { name: "CST", alias: "CST", description: "Campo de 3 bytes de comprimento", length: 3, position: 0 },
            { name: "CCLASSTRIB", alias: "CCLASSTRIB", description: "Campo de caracteres de comprimento 6", length: 6, position: 3 },
            { name: "CCREDPRES", alias: "CCREDPRES", description: "Componente do nº versão", length: 2, position: 9 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_T_I_D000": {
        description: "IBS/CBS Valores T I D",
        dataOffset: 63,
        fields: [
            { name: "PDIFUF", alias: "PDIFUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "PDIFMUN", alias: "PDIFMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "PDIFCBS", alias: "PDIFCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 20 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_T_I_R000": {
        description: "IBS/CBS Valores T I R",
        dataOffset: 63,
        fields: [
            { name: "CSTREG", alias: "CSTREG", description: "Campo de 3 bytes de comprimento", length: 3, position: 0 },
            { name: "CCLASSTRIBREG", alias: "CCLASSTRIBREG", description: "Campo de caracteres de comprimento 6", length: 6, position: 3 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_FED000": {
        description: "IBS/CBS Valores Federais",
        dataOffset: 63,
        fields: [
            { name: "PCBS", alias: "PCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "PREDALIQCBS", alias: "PREDALIQCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "PALIQEFETCBS", alias: "PALIQEFETCBS", description: "Campo de caracteres do comprimento 10", length: 10, position: 20 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_MUN000": {
        description: "IBS/CBS Valores Municipais",
        dataOffset: 63,
        fields: [
            { name: "PIBSMUN", alias: "PIBSMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "PREDALIQMUN", alias: "PREDALIQMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "PALIQEFETMUN", alias: "PALIQEFETMUN", description: "Campo de caracteres do comprimento 10", length: 10, position: 20 }
        ]
    },
    "ZKFBC_NFSE_IBSCBS_VAL_UF000": {
        description: "IBS/CBS Valores UF",
        dataOffset: 63,
        fields: [
            { name: "PIBSUF", alias: "PIBSUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 0 },
            { name: "PREDALIQUF", alias: "PREDALIQUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 10 },
            { name: "PALIQEFETUF", alias: "PALIQEFETUF", description: "Campo de caracteres do comprimento 10", length: 10, position: 20 }
        ]
    },
    "ZKFBC_NFSE_ADD_RT_FIELDS000": {
        description: "Campos Adicionais RT",
        dataOffset: 63,
        fields: [
            { name: "VALORINICIALCOBRADO", alias: "ValorInicialCobrado", description: "30 caracteres", length: 30, position: 0 },
            { name: "VALORFINALCOBRADO", alias: "ValorFinalCobrado", description: "30 caracteres", length: 30, position: 30 },
            { name: "VALORMULTA", alias: "ValorMulta", description: "30 caracteres", length: 30, position: 60 },
            { name: "VALORJUROS", alias: "ValorJuros", description: "30 caracteres", length: 30, position: 90 },
            { name: "VALORIPI", alias: "ValorIpi", description: "30 caracteres", length: 30, position: 120 },
            { name: "EXIGIBILIDADESUSPENSA", alias: "ExigibilidadeSuspensa", description: "30 caracteres", length: 30, position: 150 },
            { name: "PAGAMENTOPARCELADOANTECIPADO", alias: "PagamentoParceladoAntecipado", description: "30 caracteres", length: 30, position: 180 },
            { name: "NCM", alias: "NCM", description: "30 caracteres", length: 30, position: 210 },
            { name: "CPAIS", alias: "CPAIS", description: "30 caracteres", length: 30, position: 240 }
        ]
    },
    "ZKFBC_NFSE_CABEXT000": {
        description: "Extensões",
        dataOffset: 63,
        fields: [
            { name: "CAMPO", description: "Nome do Campo Extendido", length: 251, position: 0 },
            { name: "VALOR", description: "Texto de 500 Posições", length: 500, position: 251 }
        ]
    }
};

// Ordem dos segmentos no IDOC (baseado no arquivo de exemplo)
export const SEGMENT_ORDER = [
    "EDI_DC40",
    "ZKFBC_NFSE_NFSE000",
    "ZKFBC_NFSE_INFNFSE000",
    "ZKFBC_NFSE_EMIT000",
    "ZKFBC_NFSE_EMIT_ENDERNAC000",
    "ZKFBC_NFSE_INFNFSE_N000",
    "ZKFBC_NFSE_IDENTIFICACAORPS000",
    "ZKFBC_NFSE_SERVICO000",
    "ZKFBC_NFSE_VALORES000",
    "ZKFBC_NFSE_VALORES_RRR_D000",
    "ZKFBC_NFSE_VALORES_RRR_D_FO000",
    "ZKFBC_NFSE_VALORES_RRR_D_O000",
    "ZKFBC_NFSE_VALORES_RRR_D_N000",
    "ZKFBC_NFSE_VALORES_RRR_D_F000",
    "ZKFBC_NFSE_VALORES_T_TT000",
    "ZKFBC_NFSE_VALORES_T_TT_P000",
    "ZKFBC_NFSE_VALORES_T_TT_V000",
    "ZKFBC_NFSE_VALORES_T_TF000",
    "ZKFBC_NFSE_VALORES_T_TF_PC000",
    "ZKFBC_NFSE_VALORES_T_TM000",
    "ZKFBC_NFSE_VALORES_T_TM_ES000",
    "ZKFBC_NFSE_VALORES_T_TM_BM000",
    "ZKFBC_NFSE_VALORES_VDR_D000",
    "ZKFBC_NFSE_VALORES_VDR_F000",
    "ZKFBC_NFSE_VALORES_VDR_F_E000",
    "ZKFBC_NFSE_VALORES_VDR_F_EE000",
    "ZKFBC_NFSE_VALORES_VDR_F_EN000",
    "ZKFBC_NFSE_VALORES_VDR_D_NE000",
    "ZKFBC_NFSE_VALORES_ISSQN000",
    "ZKFBC_NFSE_DISCRIMINACAO000",
    "ZKFBC_NFSE_SERVICO_INFOCOMP000",
    "ZKFBC_NFSE_SERVICO_IC_IC000",
    "ZKFBC_NFSE_SERVICO_IC_IP000",
    "ZKFBC_NFSE_SERVICO_AE000",
    "ZKFBC_NFSE_SERVICO_AE_END000",
    "ZKFBC_NFSE_SERVICO_OBRA000",
    "ZKFBC_NFSE_SERVICO_OBRA_END000",
    "ZKFBC_NFSE_SERVICO_LSADPPU000",
    "ZKFBC_NFSE_SERVICO_LP000",
    "ZKFBC_NFSE_SERVICO_COMEXT000",
    "ZKFBC_NFSE_PRESTADORSERVICO000",
    "ZKFBC_NFSE_PS_REGTRIB000",
    "ZKFBC_NFSE_TOMADORSERVICO000",
    "ZKFBC_NFSE_INTERMEDIARIOSER000",
    "ZKFBC_NFSE_ORGAOGERADOR000",
    "ZKFBC_NFSE_CONSTRUCAOCIVIL000",
    "ZKFBC_NFSE_DESTINATARIO000",
    "ZKFBC_NFSE_DPS000",
    "ZKFBC_NFSE_DPS_INFDPS000",
    "ZKFBC_NFSE_DPS_INFDPS_S000",
    "ZKFBC_NFSE_IBSCBS000",
    "ZKFBC_NFSE_IBSCBS_IM000",
    "ZKFBC_NFSE_IBSCBS_IM_E000",
    "ZKFBC_NFSE_IBSCBS_IM_E_EX000",
    "ZKFBC_NFSE_IBSCBS_REF000",
    "ZKFBC_NFSE_IBSCBS_TOT000",
    "ZKFBC_NFSE_IBSCBS_TOT_C_TCG000",
    "ZKFBC_NFSE_IBSCBS_TOT_C000",
    "ZKFBC_NFSE_IBSCBS_TOT_C_TR000",
    "ZKFBC_NFSE_IBSCBS_TOT_C_CP000",
    "ZKFBC_NFSE_IBSCBS_TOT_G000",
    "ZKFBC_NFSE_IBSCBS_TOT_G_MUT000",
    "ZKFBC_NFSE_IBSCBS_TOT_G_UFT000",
    "ZKFBC_NFSE_IBSCBS_TOT_G_CP000",
    "ZKFBC_NFSE_IBSCBS_VAL000",
    "ZKFBC_NFSE_IBSCBS_VAL_T_I000",
    "ZKFBC_NFSE_IBSCBS_VAL_T_I_D000",
    "ZKFBC_NFSE_IBSCBS_VAL_T_I_R000",
    "ZKFBC_NFSE_IBSCBS_VAL_FED000",
    "ZKFBC_NFSE_IBSCBS_VAL_MUN000",
    "ZKFBC_NFSE_IBSCBS_VAL_UF000",
    "ZKFBC_NFSE_ADD_RT_FIELDS000",
    "ZKFBC_NFSE_CABEXT000"
];
