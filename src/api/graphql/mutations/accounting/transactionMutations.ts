const transactionMutations = {

    // MUTATION POUR CRÉER UNE TRANSACTION
    CREATE_TRANSACTION: `
  mutation Mutation($input: CreateTransactionInput!) {
    initiateTransaction(input: $input) {
      transactionId
      serviceId
      slug
      buyerUserId
      buyerOrganizationId
      sellerUserContactId
      sellerOrganizationId
      currency
      totalAmount
      state
      status
      metadata
      createdAt
      updatedAt
      deletedAt
    }
  }`,
    // MUTATION POUR METTRE À JOUR UNE TRANSACTION

};

export  {transactionMutations};