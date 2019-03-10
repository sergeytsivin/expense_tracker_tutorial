import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect, firebaseConnect, populate} from 'react-redux-firebase'

import AddCategory from './AddCategory'


class CategoryList extends Component {
    // static propTypes = {
    //     uid: PropTypes.string,
    //     categories: PropTypes.arrayOf(PropTypes.string)
    // };


    renderCategory(category) {
        return <div key={category.name}>
            <b>{category.name}</b>
            (created by: {category.user.displayName})
        </div>
    }

    render() {

        const {categories} = this.props;

        if (!categories) {
            return <div/>
        }

        console.log('categories', categories);

        const categoryItems = Object.values(categories).map(
            (category) => this.renderCategory(category)
        );

        return (
            <div>
                <div>
                    {categoryItems}
                </div>
                <AddCategory/>
            </div>
        )
    }
}

const collection = 'categories';


const populates = (dataKey, originalData) => {
    console.log('populates', dataKey, originalData);
    // debugger;
    if (dataKey === 'categories') {
        Object.keys(originalData).forEach((key) => { originalData[key].user = originalData[key].userRef.path.split('/')[1] })
    }
    else if (dataKey) {
        originalData['user'] = originalData.userRef.path.split('/')[1];
    }
    return [{child: 'user', root: 'users'}]
};

// const populates = [
//     {child: 'user', root: 'users'} // replace uid with user object
//     // {child: 'userRef', root: 'users'} // replace uid with user object
// ];

const mapStateToProps = state => {
    return {
        uid: state.firebase.auth.uid,
        categories: populate(state.firestore, collection, populates)
        // categories: state.firestore.ordered.categories ? state.firestore.ordered.categories.map(c => c.name) : [],
    }
};

const mapDispatchToProps = {};

export default compose(
    firestoreConnect(
        (props) => {
            return [
                {
                    collection,
                    populates
                }
            ]
        }
    ),
    connect(mapStateToProps, mapDispatchToProps),
)(CategoryList)

