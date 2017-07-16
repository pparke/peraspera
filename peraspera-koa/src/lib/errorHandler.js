export default async function errorHandler(ctx, next) {
  try {
    await next();
  }
  catch (err) {
		console.log(err.stack);
    ctx.throw(err.status || 500, err.message);
  }
}
