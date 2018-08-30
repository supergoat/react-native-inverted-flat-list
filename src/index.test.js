// @flow
import React from 'react';
import InvertedFlatList from './index';
import renderer from 'react-test-renderer';

describe('InvertedFlatList', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<InvertedFlatList />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
