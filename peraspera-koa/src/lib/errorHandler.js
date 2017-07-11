export default async function errorHandler(ctx, next) {
  try {
    await next();
  }
  catch (err) {
    ctx.throw(err.status || 500, err.message);
  }
}
