
export default function toResource <k> (promise : Promise<k>) {
    let status = 'pending'
    let response : k;
    let error : Error;
  
    const suspender = promise.then(
      (res) => {
        status = 'success'
        response = res
      },
      (err) => {
        status = 'error'
        error = err
      },
    )

    const read = () => {
        switch (status) {
          case 'pending':
            throw suspender
          case 'error':
            throw error
          default:
            return response
        }
      }
    
      return { read }
    }