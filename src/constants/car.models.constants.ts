import { EBrands, EModels } from "../enums";

export const carModelsConstants: Record<EBrands, EModels[]> = {
  [EBrands.VOLKSWAGEN]: [
    EModels.VOLKSWAGEN_ARTEON,
    EModels.VOLKSWAGEN_ATLAS,
    EModels.VOLKSWAGEN_BORA,
    EModels.VOLKSWAGEN_TOUAREG,
  ],
  [EBrands.BMW]: [
    EModels.BMW_3_SERIES_GT,
    EModels.BMW_5_SERIES_GT,
    EModels.BMW_4_SERIES_GRAN_COUPE,
    EModels.BMW_6_SERIES_GT,
  ],
  [EBrands.AUDI]: [
    EModels.AUDI_5000,
    EModels.AUDI_80,
    EModels.AUDI_A3,
    EModels.AUDI_A4,
  ],
  [EBrands.CHEVROLET]: [
    EModels.CHEVROLET_CAPTIVA,
    EModels.CHEVROLET_AVEO,
    EModels.CHEVROLET_BOLT_EV,
    EModels.CHEVROLET_CAMARO,
  ],
  [EBrands.LEXUS]: [
    EModels.LEXUS_CT,
    EModels.LEXUS_HS,
    EModels.LEXUS_LC,
    EModels.LEXUS_LF,
  ],
};
