const subdomains = 'subdomains';

const mapWhiteLabels = function (whiteLabels) {
  const subDomains = {};

  whiteLabels.forEach((item) => {
    if (!subDomains[item.subdomain]) {
      subDomains[item.subdomain] = {};
    }
    subDomains[item.subdomain] = item;
  });
  return subDomains;
};

module.exports = {
  subdomains,
  mapWhiteLabels,
};
