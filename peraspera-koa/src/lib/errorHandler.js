export default async function errorHandler(ctx, next) {
  try {
    await next();
  }
  catch (err) {
    ctx.throw(err.message, err.status || 500);
  }
}
