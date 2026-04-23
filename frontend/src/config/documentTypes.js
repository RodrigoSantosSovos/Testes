export const FIELD_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
  DOUBLE: 'double',
  DATETIME: 'datetime',
  RADIO: 'radio',
}

export const RADIO_OPTIONS_KEY = 'radioApproval'

export const PROCESS_OPTIONS = [
  { value: '0', labelKey: 'outbound' },
  { value: '1', labelKey: 'inbound' },
]

export const SITUATION_OPTIONS = [
  { value: '-1', labelKey: 'all' },
  { value: '0', labelKey: 'processing' },
  { value: '1', labelKey: 'finishedSuccess' },
  { value: '2', labelKey: 'finishedError' },
]

export const documentTypes = {
  'AR-FEV1Authorize': {
    labelKey: 'arAfipLocalInvoice',
    country: 'AR',
    actions: {
      '0': [{ value: 'authorize', labelKey: 'actionAuthorize' }],
      '1': [{ value: 'receive', labelKey: 'actionReceive' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cuitContribuyente', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'cuitReceptor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'factura', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'fechaComprobante', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar6', labelKey: 'puntoDeVentas', type: FIELD_TYPES.STRING },
    ],
  },

  'AR-FEAuthorize': {
    labelKey: 'arAfipLocalInvoiceMtx',
    country: 'AR',
    actions: {
      '0': [{ value: 'authorize', labelKey: 'actionAuthorize' }],
      '1': [{ value: 'receive', labelKey: 'actionReceive' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cuitContribuyente', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'cuitReceptor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'factura', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'fechaComprobante', type: FIELD_TYPES.STRING },
      { tag: 'TagInt1', labelKey: 'tipoComprobante', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'puntoVenta', type: FIELD_TYPES.INTEGER },
      { tag: 'TagVarchar7', labelKey: 'codigoTipoAutorizacion', type: FIELD_TYPES.STRING },
    ],
  },

  'AR-FEXAuthorize': {
    labelKey: 'arAfipExportInvoice',
    country: 'AR',
    actions: {
      '0': [{ value: 'authorize', labelKey: 'actionAuthorize' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cuitContribuyente', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'cuitReceptor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar4', labelKey: 'identificador', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'fechaComprobante', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'puntoDeVentasInt', type: FIELD_TYPES.INTEGER },
    ],
  },

  'BR-nfeProc': {
    labelKey: 'brNfe',
    country: 'BR',
    actions: {
      '0': [
        { value: 'send', labelKey: 'actionSend' },
        { value: 'cancel', labelKey: 'actionCancel' },
      ],
      '1': [{ value: 'receive', labelKey: 'actionReceive' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cnpjEmissor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'cnpjReceptor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'chaveAcesso', type: FIELD_TYPES.STRING },
      { tag: 'TagInt1', labelKey: 'serie', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'numeroDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoNumerico', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt4', labelKey: 'ambiente', type: FIELD_TYPES.INTEGER, choices: { 1: 'Produção', 2: 'Homologação' } },
      { tag: 'TagDate1', labelKey: 'dataEmissao', type: FIELD_TYPES.DATETIME },
      { tag: 'TagInt5', labelKey: 'statusSefaz', type: FIELD_TYPES.RADIO },
      { tag: 'TagInt6', labelKey: 'statusSefaz2', type: FIELD_TYPES.RADIO },
    ],
  },

  'BR-nf3eProc': {
    labelKey: 'brNf3e',
    country: 'BR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cnpjEmissor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'numeroDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoNumerico', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt4', labelKey: 'ambiente', type: FIELD_TYPES.INTEGER, choices: { 1: 'Produção', 2: 'Homologação' } },
    ],
  },

  'BR-cteProc': {
    labelKey: 'brCte',
    country: 'BR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
      '1': [{ value: 'receive', labelKey: 'actionReceive' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cnpjEmissor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'cnpjReceptor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt1', labelKey: 'serie', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'numeroDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'dataEmissao', type: FIELD_TYPES.DATETIME },
    ],
  },

  'BR-mdfeProc': {
    labelKey: 'brMdfe',
    country: 'BR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagInt1', labelKey: 'serie', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'numMdf', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'dtHrEmissao', type: FIELD_TYPES.DATETIME },
    ],
  },

  'BR-inutNFe': {
    labelKey: 'brInutNfe',
    country: 'BR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagInt1', labelKey: 'serie', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'numInicial', type: FIELD_TYPES.INTEGER },
    ],
  },

  'BR-RePrint': {
    labelKey: 'brReprint',
    country: 'BR',
    actions: {},
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cnpj', type: FIELD_TYPES.STRING },
    ],
  },

  'BR-NfsePedidoCancelamento': {
    labelKey: 'brNfseCancelamento',
    country: 'BR',
    actions: {
      '0': [{ value: 'cancel', labelKey: 'actionCancel' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'cnpjPrestador', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar6', labelKey: 'inscricaoMunicipal', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'numNfse', type: FIELD_TYPES.INTEGER },
      { tag: 'TagVarchar5', labelKey: 'codigoCancelamento', type: FIELD_TYPES.STRING },
    ],
  },

  'CL-DTE': {
    labelKey: 'clDte',
    country: 'CL',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
      '1': [{ value: 'receive', labelKey: 'actionReceive' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rutEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt1', labelKey: 'tipo', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt2', labelKey: 'folio', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'CL-RESULTADO_ENVIO': {
    labelKey: 'clResultadoEnvio',
    country: 'CL',
    actions: {},
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rutEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'rutEnvia', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'trackingId', type: FIELD_TYPES.STRING },
    ],
  },

  'CL-RESULTADO_ENVIO_LIBRO': {
    labelKey: 'clResultadoEnvioLibro',
    country: 'CL',
    actions: {},
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rutEmisor', type: FIELD_TYPES.STRING },
    ],
  },

  'CL-LibroCompraVenta': {
    labelKey: 'clLibroCompraVenta',
    country: 'CL',
    actions: {},
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rutEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'referencia', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'tipoOperacion', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar4', labelKey: 'tipoLibro', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'tipoEnvio', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar9', labelKey: 'trackingId', type: FIELD_TYPES.STRING },
    ],
  },

  'CR-FacturaElectronica': {
    labelKey: 'crFactura',
    country: 'CR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'emisorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'emisorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'receptorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar4', labelKey: 'receptorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'clave', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar8', labelKey: 'numeroConsecutivo', type: FIELD_TYPES.STRING },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'CR-TiqueteElectronico': {
    labelKey: 'crTiquete',
    country: 'CR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'emisorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'emisorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'receptorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar4', labelKey: 'receptorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'clave', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar8', labelKey: 'numeroConsecutivo', type: FIELD_TYPES.STRING },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'CR-NotaDebitoElectronica': {
    labelKey: 'crNotaDebito',
    country: 'CR',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'emisorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar3', labelKey: 'emisorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar5', labelKey: 'receptorNumeroCedula', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar4', labelKey: 'receptorNombre', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar2', labelKey: 'clave', type: FIELD_TYPES.STRING },
      { tag: 'TagVarchar8', labelKey: 'numeroConsecutivo', type: FIELD_TYPES.STRING },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'EC-factura': {
    labelKey: 'ecFactura',
    country: 'EC',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rucEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'secuencial', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'EC-notaDebito': {
    labelKey: 'ecNotaDebito',
    country: 'EC',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rucEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'secuencial', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },

  'EC-notaCredito': {
    labelKey: 'ecNotaCredito',
    country: 'EC',
    actions: {
      '0': [{ value: 'send', labelKey: 'actionSend' }],
    },
    filters: [
      { tag: 'TagVarchar1', labelKey: 'rucEmisor', type: FIELD_TYPES.STRING },
      { tag: 'TagInt2', labelKey: 'secuencial', type: FIELD_TYPES.INTEGER },
      { tag: 'TagInt3', labelKey: 'codigoDocumento', type: FIELD_TYPES.INTEGER },
      { tag: 'TagDate1', labelKey: 'fechaEmision', type: FIELD_TYPES.DATETIME },
    ],
  },
}

export function getDocumentTypeOptions() {
  return Object.entries(documentTypes).map(([id, cfg]) => ({
    id,
    labelKey: cfg.labelKey,
    country: cfg.country,
  }))
}

export function getActionsForType(typeId, process) {
  const cfg = documentTypes[typeId]
  if (!cfg || !cfg.actions) return []
  return cfg.actions[process] || []
}

export function getFiltersForType(typeId) {
  const cfg = documentTypes[typeId]
  if (!cfg) return []
  return cfg.filters
}
