import { gql } from "graphql-request";

const publishNewPostQuery = gql`
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        url
      }
    }
  }
`;

export default publishNewPostQuery;
