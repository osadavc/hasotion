import { gql } from "graphql-request";

const updatePostQuery = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        id
        url
      }
    }
  }
`;

export default updatePostQuery;
