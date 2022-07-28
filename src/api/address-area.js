import ajax from '@/lib/ajax';

/**
 * 省
 */
export function getProvinces() {
  return ajax({
    api: 'areas/provinces',
  });
}

/**
 * 市
 */
export function getCity(code) {
  return ajax({
    api: `areas/${code}/cities`,
  });
}

/**
 * 区
 */
export function getCountry(code) {
  return ajax({
    api: `areas/${code}/districts`,
  });
}

/**
 * 街道
 */
export function getStreets(code) {
  return ajax({
    api: `areas/${code}/streets`,
  });
}

/**
 * 获取村社
 */
export function getVillages(code) {
  return ajax({
    api: `areas/${code}/villages`,
    data: {
      skipDeptId: 1,
    },
  });
}
