​export enum SubjectNotice {
    person = 'Person ',
    people = 'People ',
    user = 'User '
  }

export enum TextNotice {
    loadingState = 'Loading',
    loggedInState = 'Logged In',
    notloggedInState = 'No person logged in',
    wrongPasswordState = 'Wrong password, name or combination',
    blankState = '',
    updateOk = 'Update Successful',
    createOk = 'Create Successful',
    deleteOk = 'Delete Successful',
    createError = 'Create Successful',​​
    deleteError = 'Delete Error',
    updateError = 'Update Error',
    loadError = 'Load Error',
    unknownError = 'Something went wrong',
    loadOk = 'Load Successfull'
  }

 ​export enum StateNotice {
    success = 'success',
    warn = 'warn',
    error = 'error',
    neutral = 'neutral'
  }

export enum CommPersonToDetail {
    create = 'CREATE',
    select = 'SELECT'
  }

export enum CommDetailToPerson {
    created = 'CREATED',
    updated = 'UPDATED',
    deleted = 'DELETED',
    close = 'CLOSE'
}
