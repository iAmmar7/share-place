import React, { useState } from 'react';

import DefaultInput from '../UI/DefaultInput/DefaultInput';

const placeInput = (props) => (
  <DefaultInput
    placeholder='Place Name'
    value={props.placeData.value}
    onChangeText={props.onChangeText}
  />
);

export default placeInput;
