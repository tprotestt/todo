import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { View, Text } from 'native-base';
import AddTodoButton from './AddTodoButton'
import TodoModel from './../api/todos';
import Header from '../components/Header';
import COLORS from '../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import AddTodo from './AddTodo';
import { ReactiveList } from '@appbaseio/reactivesearch-native';
import {FlatList} from 'react-native';
import CONSTANTS from '../constants';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    row: {
        top: 15,
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// will render todos based on the active screen: all, active or completed
export default class TodosContainer extends React.Component {
    onAllData = (todos, streamData) => {
        const filterData = this.filterTodosData(todos);

        return(
            <FlatList  
                style={{ width: '100%', top: 15 }}
                data={filteredData}
                keyExtractor={item => item._id}
                renderItem={({item: todo}) => (
                        <Text>{todo.title}</Text>
                )}
            />
        );
    };
    filterTodosData = (todosData) => {
        const { screen } = this.props;

        switch (screen) {
            case CONSTANTS.ALL:
                return todosData;
            case CONSTANTS.ACTIVE:
            return todosData.filter(todo => todo.completed);
        }

        return todosData;
    };
    render() {
        return (
            <View style={styles.container}>
                <Header />
                <StatusBar backgrounColor={COLORS.primary} barStyle="light-content" />
                <ScrollView>
                    <ReactiveList
                        onAllData
                        componentID="ReactiveList"
                        defaultQuery={() => ({
                            query: {
                                match_all: {},
                            
                            },
                        })}
                        stream 
                        onAllData={this.onAllDate}
                        dataField="title"
                        showResultStats={false}
                        pagination={false}
                    
                    />
                </ScrollView>
                <AddTodoButton onPress={() => this.setState({addingTodo : true })} />
            </View>
        );
    }
    state = {
        addingTodo: false,
    };
    componentDidMount() {
        // includes the methods for creation, updation and deletion
        this.api = new TodoModel('react-todos');
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
                <ScrollView>
                    {this.state.addingTodo ? (
                        <View style={styles.row}>
                            <AddTodo
                                onAdd={(todo) => {
                                    this.setState({ addingTodo: false });
                                    this.api.add(todo);
                                }}
                                onCancelDelete={() => this.setState({ addingTodo: false })}
                                onBlur={() => this.setState({ addingTodo: false})}
                            />
                        </View>
                    ) : null}
                </ScrollView>
                <AddTodoButton onPress={() => this.setState({ addingTodo: true })} />
            </View>
             );   
            <View style={styles.center}>
                <Text>Todos Container</Text>
                <AddTodoButton />
            </View>
            
       
    }
}
