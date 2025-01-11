import type { Context } from 'aws-lambda'

export interface WithContextDeps {
  //
}

interface Options {
  captureHttp?: boolean
}

export const withContext = <TAWSEvent, TResult = unknown>(
  fn: (
    deps: WithContextDeps,
    event: TAWSEvent,
    context: Context
  ) => Promise<TResult>,
  _: Options = {
    //
  }
) => {
  return (event: TAWSEvent, context: Context) =>
    fn(
      {
        //
      },
      event,
      context
    )
}
