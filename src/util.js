export const checkMockAvailability = () => {
  return localStorage.getItem('MOCK_AVAILABILITY') !== 'false';
};

export const setMockAvailability = (able) => {
  localStorage.setItem('MOCK_AVAILABILITY', able);
};

export const getMockOption = () => {
  try {
    let key = localStorage.getItem('MOCK_OPTION').split('&&').map(item => {
      return item.split('@@')[1];
    })
    return {
      project: key[0],
      version: key[1]
    };
  } catch (ex) {
    return {
      project: '',
      version: ''
    }
  }
};

export const setMockOption = (project, version) => {
  localStorage.setItem('MOCK_OPTION', 'project@@' + project + '&&version@@' + version);
}
