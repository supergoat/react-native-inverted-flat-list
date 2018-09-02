import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

/* Constants
============================================================================= */
const REFRESH_OFFSET = 20;

/** ============================================================================
<InvertedFlatList />
@param { Integer } refreshOffset - The offset from the top before
                                   onPullToRefresh is triggered
@param { function } onPullToRefresh - Function called when viewer scrolls to top
--------------------------------------------------------------------------------
React native inverted flat list with the ability to use pull to refresh
============================================================================= */
class InvertedFlatList extends Component {

  static defaultProps = {
    refreshOffset: REFRESH_OFFSET,
    onScroll: () => {}
  }

  /**
   * @description Returns a boolean if the viewer scrolled to the top
   * @param { object } nativeEvent - The scroll Event
   *
   * @returns { boolean } True if the viewer is close to the top
   */
  isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    // The offset from the top, before we should load more messages
    const { refreshOffset } = this.props;

    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - refreshOffset;
  };

  /**
   * Calls onScroll function from props if present and onRefresh
   */
  onScroll = (e) => {
    // Call onScroll from props if present
    this.props.onScroll(e);

    this.onRefresh(e);
  }

  /**
   * Calls onPullToRefresh if its present and the viewer is scrolled to the top
   */
  onRefresh = ({ nativeEvent }) => {
    const { onPullToRefresh } = this.props;

    // If onPullToRefresh is not defined return
    if (!onPullToRefresh) return;

    // Return if viewer didn't scroll to top
    if (!this.isCloseToTop(nativeEvent)) return;

    onPullToRefresh();
  }

  /**
   * Returns an activityIndicator if onPullToRefresh is present in props
   */
  getActivityIndicator = () => (
    this.props.onPullToRefresh &&
      <View style={this.props.refreshing && styles.activityIndicator}>
        <ActivityIndicator animating={this.props.refreshing} />
      </View>
  )

  render() {
    const {
      ListHeaderComponent,
      ListFooterComponent,
      refreshing,
      onPullToRefresh,
      ...rest
    } = this.props;

    return (
      <FlatList
        {...rest} // Pass the remaining props to the flatlist
        inverted
        refreshing={refreshing}
        // NOTE: This is actually the header since the flatlist is inverted
        ListFooterComponent={() => (
          <View>
            {this.getActivityIndicator()}
            {ListHeaderComponent && <ListHeaderComponent />}
          </View>
        )}
        // NOTE: This is actually the footer since the flatlist is inverted
        ListHeaderComponent={() => (
          <View>
            {ListFooterComponent && <ListFooterComponent />}
          </View>
        )}
        onScroll={this.onScroll}
      />
    )
  }
}

/* StyleSheet
============================================================================= */
const styles = StyleSheet.create({
  activityIndicator: {
    paddingVertical: 12
  }
});

/* Export
============================================================================= */
export default InvertedFlatList;
