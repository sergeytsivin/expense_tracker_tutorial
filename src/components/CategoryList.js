import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect, firebaseConnect, populate} from 'react-redux-firebase'

import AddCategory from './AddCategory'


class CategoryList extends Component {

    static renderCategory(category) {
        return <div key={category.name}>
            <b>{category.name}</b>
            (created by: {category.userData.displayName})
        </div>
    }

    render() {

        const {categories} = this.props;

        if (!categories) {
            return <div/>
        }

        console.log('categories', categories);

        const categoryItems = Object.values(categories).map(
            (category) => CategoryList.renderCategory(category)
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

    if (originalData && originalData['userRef'] && !originalData['userData']) {
        originalData['userData'] = originalData.userRef.path.split('/')[1];
    }

    return [{child: 'userData', root: 'users'}]
};

const mapStateToProps = state => {
    return {
        uid: state.firebase.auth.uid,
        categories: populate(state.firestore, collection, populates)
    }
};

const mapDispatchToProps = {};

export default compose(
    firestoreConnect([{collection, populates}]),
    connect(mapStateToProps, mapDispatchToProps),
)(CategoryList)

