import { ThingInfo, ThingType } from '@traent/ngx-components';

const thingTypeInfo: Record<ThingType, ThingInfo> = {
  [ThingType.Generic]: { name: 'i18n.Things.Type.generic', icon: undefined, svgIcon: 'things' },
  [ThingType.IoTDevice]: { name: 'i18n.Things.Type.ioTDevice', icon: undefined, svgIcon: 'iot' },
  [ThingType.Sensor]: { name: 'i18n.Things.Type.sensor', icon: 'sensors', svgIcon: undefined },
  [ThingType.Smartphone]: { name: 'i18n.Things.Type.smartphone', icon: 'phone_iphone', svgIcon: undefined },
  [ThingType.WebService]: { name: 'i18n.Things.Type.webService', icon: 'language', svgIcon: undefined },
};

export const getThingTypeInfo = (type: string | null | undefined) =>
  type == null
    ? type
    : thingTypeInfo[type as ThingType] ?? thingTypeInfo[ThingType.Generic];
