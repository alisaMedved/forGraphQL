import {withStyles} from '@material-ui/core/styles';
import {compose} from 'recompose';
import {graphql} from 'react-apollo';


import {addDirectorMutation, updatedDirectorMutation} from './mutations';
import {directorsQuery} from '../DirectorsTable/queries';


import {styles} from './styles';


const withGraphqlAdd = compose(
    graphql(addDirectorMutation, {
        props: ({mutate}) => ({
            addDirector: director => mutate({
                variables: director,
                refetchQueries: [{query: directorsQuery}],
            }),
        }),
    }),
    graphql(updatedDirectorMutation, {
        props: ({mutate}) => ({
            updateDirector: director => mutate({
                variables: director,
                refetchQueries: [{query: directorsQuery}],
            }),
        }),
    })
);


export default compose(withStyles(styles), withGraphqlAdd);
