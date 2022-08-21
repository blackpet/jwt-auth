import {generateToken, verifyToken} from '../src/lib/authentication';
import {JwtPayload, TokenExpiredError} from 'jsonwebtoken';

describe('jwt verify test', function () {
  const expired_token = {
    access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YjMzOGFkZi1hMzgwLTQwYjItYTQyNy1mY2FmMTc4OTNiOTQiLCJpc3MiOiJmb28iLCJpYXQiOjE2NjEwODg2ODYsImV4cCI6MTY2MTA4ODcxNn0.CkFk-GMGHVrtXQYCWlK15GRGoy2cKkgJrmpLXqLcYeg',
    refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YjMzOGFkZi1hMzgwLTQwYjItYTQyNy1mY2FmMTc4OTNiOTQiLCJpYXQiOjE2NjEwODg2ODYsImV4cCI6MTY2MTA4ODc0Nn0.9sM96-aNocbNSS3cvyGXgDTB_d5TUNhXPPNRHryYSic',
  }

  // mock env
  const env = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = {...env, TOKEN_SECRET: 'blackpetisgeniusdeveloper'}
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
