This is based on https://dusty.phillips.codes/2018/08/25/react-redux-firebase-with-firestore-tutorial/

It builds upon the above tutorial and goes on to use https://github.com/prescottprue/redux-firestore#population

Documentation for Populate has an [example data ](http://react-redux-firebase.com/docs/populate#example-data) which is using plain string IDs.

However, it would be helpful to consider the case when Firestore's built-in  [Reference data type](https://firebase.google.com/docs/firestore/manage-data/data-types) is used for "linking", for example:

```javascript
"todos": {
  "ASDF123": {
    "text": "Some Todo Item",
    "owner": DocumentReference("users/Iq5b0qK2NtgggT6U3bU6iZRGyma2")
   }
 },
 "users": {
   "Iq5b0qK2NtgggT6U3bU6iZRGyma2": {
     "displayName": "Morty Smith",
     "email": "mortysmith@gmail.com"
   }
}
```
In this case `owner` attribute always refers to the documents in `users` collection, so
one could use plain string ids instead of references. However, as I am not allowed
to change the data schema, I have to seek a workaround.

Once I have realized that `populates` parameter can be a function I did create a workaround:

```javascript

const collection = 'todos';
const populates = (dataKey, originalData) => {
   if (originalData && originalData['owner'] && !originalData['ownerData']) {
        originalData['ownerData'] = originalData.owner.path.split('/')[1];
    }
    return [{child: 'ownerData', root: 'users'}]
};

const mapStateToProps = state => {
    return {
        uid: state.firebase.auth.uid,
        todos: populate(state.firestore, collection, populates)
    }
};
const enhancer = compose(
    firestoreConnect([{collection, populates}]),
    connect(mapStateToProps),
);
```
This code first extracts the user document ID from the `owner` attribute and then uses this ID to initialize a new `ownerData` attribute. Finally `ownerData` attribute is populated as usual.
