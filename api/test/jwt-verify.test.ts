import {generateToken, verifyToken} from '../src/lib/authentication';
import {JwtPayload, TokenExpiredError} from 'jsonwebtoken';

describe('jwt verify test', function () {
  const expired_token = {
    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDZmMWJjMC0zNzE5LTRkZWItYTRjMC0wZTExZmIxNWUxZWQiLCJpc3MiOiJhZG1pbiIsImlhdCI6MTY2MTA5NDE2NSwiZXhwIjoxNjYxMDk0MTk1fQ.suBaJSRAs5fB3QNcWx8kfO31EuIpeVvDffM3X0_M-u4",
    refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDZmMWJjMC0zNzE5LTRkZWItYTRjMC0wZTExZmIxNWUxZWQiLCJpYXQiOjE2NjEwOTQxNjUsImV4cCI6MTY2MTA5NDIyNX0.q2K0FVIu_8BVCwEBMMieN6viriM2y_8U91ix2V1_2zM"
  }

  // mock env
  const env = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = {...env, TOKEN_SECRET: 'secret'}
  })

  afterEach(() => {
    process.env = env
  })

  it('create jwt', function () {
    //given
    const userId = 'foo'
    const tokens = generateToken(userId)

    //when/then
    expect('access' in tokens).toBeTruthy()
  });

  it('should token valid', async function () {
    // given
    const userId = 'foo'
    const tokens = generateToken(userId)

    //when
    const decoded: JwtPayload = await verifyToken(tokens.access) as JwtPayload
    console.log('decoded', decoded)

    //then
    expect('sub' in decoded).toBeTruthy()
  });

  it('should token expired', async function () {
    // given

    //when/then
    await expect(async () => {
      await verifyToken(expired_token.access)
    }).rejects.toThrowError(TokenExpiredError)
  });
});
