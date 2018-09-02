// @flow
import React from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import InvertedFlatList from './index';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('InvertedFlatList', () => {
  it('renders correctly', () => {
    const data = [{ id: '1' }]

    const tree = renderer.create(
      <InvertedFlatList
        keyExtractor={item => item.id}
        data={data}
        renderItem={() => (
          <View>
            <Text>Hello World</Text>
          </View>
        )}
      />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays ListHeaderComponent inside ListFooterComponent if its passsed as a prop', () => {
    const data = [{ id: '1' }]

    const tree = renderer.create(
      <InvertedFlatList
        keyExtractor={item => item.id}
        data={data}
        ListHeaderComponent={() => (
          <View>
            <Text>List Header</Text>
          </View>
        )}
        renderItem={() => (
          <View>
            <Text>Hello World</Text>
          </View>
        )}
      />).toJSON()

    expect(tree).toMatchSnapshot();
  });

  it('displays ListFooterComponent inside ListHeaderComponent if its passsed as a prop', () => {
    const data = [{ id: '1' }]

    const tree = renderer.create(
      <InvertedFlatList
        keyExtractor={item => item.id}
        data={data}
        ListFooterComponent={() => (
          <View>
            <Text>List Header</Text>
          </View>
        )}
        renderItem={() => (
          <View>
            <Text>Hello World</Text>
          </View>
        )}
      />).toJSON();
    expect(tree).toMatchSnapshot();
  })

  describe('isCloseToTop', () => {
    it('returns false when the viewer does not scroll to the top', () => {
      const data = [{ id: '1' }]

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={data}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      const nativeEvent = {
        layoutMeasurement: { height: 100 },
        contentOffset: { y: 100},
        contentSize: { height: 300}
      };
      expect(component.instance().isCloseToTop(nativeEvent)).toEqual(false);
    });

    it('returns true when the viewer scrolls to the top', () => {
      const data = [{ id: '1' }]
      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={data}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      // Set the contentSize.height to a number LOWER than
      // layoutMeasurement.height + contentOffset.y
      // to simulate viewer being scrolled to the top
      const nativeEvent = {
        layoutMeasurement: { height: 100 },
        contentOffset: { y: 100},
        contentSize: { height: 190}
      };
      expect(component.instance().isCloseToTop(nativeEvent)).toEqual(true);
    });
  });

  describe('onScroll', () => {
    it('calls onScroll from props', () => {
      const onScroll = jest.fn();

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          onScroll={onScroll}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      const nativeEvent = {
        layoutMeasurement: { height: 100 },
        contentOffset: { y: 100},
        contentSize: { height: 190}
      };

      component.instance().onScroll({nativeEvent})
      expect(onScroll).toHaveBeenCalled()
    });
  });

  describe('onPullToRefresh', () => {
    it('does nothing if the viewer is not scrolled to the top', () => {
      const onPullToRefresh = jest.fn();

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          onPullToRefresh={onPullToRefresh}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      component.instance().isCloseToTop = jest.fn(() => false);

      const nativeEvent = {}; // nativeEvent won't be used
      component.instance().onScroll({nativeEvent})
      expect(onPullToRefresh).not.toHaveBeenCalled()
    });

    it('calls onPullToRefresh if the viewer scrolls to the top and onPullToRefresh is passed as a prop', () => {
      const onPullToRefresh = jest.fn();

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          onPullToRefresh={onPullToRefresh}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      component.instance().isCloseToTop = jest.fn(() => true);

      const nativeEvent = {}; // nativeEvent won't be used
      component.instance().onScroll({nativeEvent})
      expect(onPullToRefresh).toHaveBeenCalled()
    });
  });

  describe('getActivityIndicator', () => {
    it('returns undefined if onPullToRefresh is not present', () => {
      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      expect(component.instance().getActivityIndicator()).toEqual(undefined)
    });

    it('returns an activityIndicator if onPullToRefresh is present', () => {
      const onPullToRefresh = jest.fn();

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          onPullToRefresh={onPullToRefresh}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      expect(component.instance().getActivityIndicator())
        .toEqual(
          <View>
            <ActivityIndicator />
          </View>
        )
    });

    it('displays an activityIndicator if onPullToRefresh is present and refreshing is true', () => {
      const onPullToRefresh = jest.fn();

      const component = shallow(
        <InvertedFlatList
          keyExtractor={item => item.id}
          data={[]}
          refreshing={true}
          onPullToRefresh={onPullToRefresh}
          renderItem={() => (
            <View>
              <Text>Hello World</Text>
            </View>
          )}
        />
      );

      expect(component.instance().getActivityIndicator())
        .toEqual(
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator animating={true} />
          </View>
        )
    });
  })
});
