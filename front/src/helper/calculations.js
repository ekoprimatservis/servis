export const applyDiscount = (arr, discount) => {
  const price = arr.reduce(
    (partialSum, a) => partialSum + a.attributes.price,
    0
  );

  if (!discount) {
    return Math.round(price * 100) / 100;
  } else {
    const disscountInRSD = price * (discount / 100);
    return Math.round((price - disscountInRSD) * 100) / 100;
  }
};

export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace("381", "0").replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};
export const formatLandLinePhone = (phoneNumberString) => {
  if (!phoneNumberString) return null
  const cleaned = phoneNumberString
    .replace(/^(\+)?381/, '0') // Replace country code with local prefix
    .replace(/\D/g, '');       // Remove non-digit characters

  // Match: 2-digit area code + 6–7 digit subscriber number
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{3})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return null;
};
export const formulaPicker = (id, payload) => {
  let returnObj = {};
  switch (id) {
    case 1: // rectangle area
      returnObj = { id: 1, payload };
      break;
    case 2: // circle area
      returnObj = {
        id: 2,
        label: "precnik",
        payload: { ...payload, height: payload?.width / 2, width: payload?.width / 2 },
      };
      break;
    case 3: // a single item
      returnObj = { id: 3, label: "komad", payload: { ...payload, height: 1 } };
      break;
    case 4: // tassels
      returnObj = {
        id: 4,
        label: "duzina",
        payload: { ...payload, height: 1 },
      };
      break;
  }
  return returnObj;
};
