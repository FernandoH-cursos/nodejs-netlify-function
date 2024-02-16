const formatAdapter = {
  arrayToString: (array: string[], separator: string = ", "): string => {
    return array.join(separator);
  },
};

export default formatAdapter;