/**
 * A set of functions called "actions" for `health`
 */

export default {
  async check(ctx: any) {
    ctx.body = {
      status: "ok",
      message: "Thikmotoi kaj kortese",
      timestamp: new Date().toISOString(),
    };
  },
};
