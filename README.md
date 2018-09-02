<h1>React Native Inverted FlatList</h1>

InvertedFlatList enables on pull to refresh functionality. Ideal to use when
you need an infinite scrolling list loading more data when the user scrolls to
the top using the onPullToRefresh method.

The ```onEndReached``` method on ```<FlatList inverted ... />``` cannot be used
as it is only called once. This is problematic if the loading of more data
fails, for example when there is a network connection problem.


:warning: WARNING :warning:

InvertedFlatList enables the ```onPullToRefresh``` functionality using the
```onScroll``` method on the flatlist. It has not been tested when passing a
custom ```onScroll``` prop. If you run into any problems using it, please create
an issue

<h3>Documentation</h3>

<h4>Install</h4>

```shell
$ npm install react-native-inverted-flat-list --save
```

OR

```shell
$ yarn add react-native-inverted-flat-list
```

<h4>Example</h4>

```javascript
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import InvertedFlatList from 'react-native-inverted-flat-list';

class InfiniteScrollingList extends Component {
  state = {
    refreshing: false,
    // NOTE: The messages should be in reverse order
    messages: [
      { id: '5', text: 'Me too!'},
      { id: '4', text: 'I am fine thanks! How are you?'},
      { id: '3', text: 'How is it going?'},
      { id: '2', text: 'Hey'},
      { id: '1', text: 'Hello'}
    ]
  }

  onPullToRefresh = () => {
    const { refreshing, messages } = this.state;

    // Return early if already refreshing
    if (refreshing) return;

    this.setState({refreshing: true});

    // Load more messages
    const moreMessages = ...;

    const copyMessages = messages.slice();
    const newMessages = copyMessages.concat(moreMessages);

    this.setState({
      refreshing: false,
      messages: newMessages
    });
  }

  render() {
    <InvertedFlatList
      refreshing={refreshing} // required
      data={data} // required
      keyExtractor={item => item.id} // required
      onPullToRefresh={this.onPullToRefresh}
      renderItem={({ item }) => ( // required
        <View>
          <Text>{item.text}</Text>
        </View>
      )}
    />
  }
}

```

<h4>Props</h4>

* FlatList <a href="https://facebook.github.io/react-native/docs/flatlist#props">props</a>
* refreshOffset - The offset from the top before onPullToRefresh is triggered
* onPullToRefresh - Function called when viewer scrolls to top

<h3>Example Projects</h3>

For projects using react-native-inverted-flat-list


* <a href="https://github.com/supergoat/chat-app">ChatApp</a>


<h3>License</h3>
<a href="./LICENSE">MIT</a>
