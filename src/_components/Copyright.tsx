import { Link, Typography } from '@material-ui/core';

/**
 * コピーライトコンポーネント
 * @param props 引数
 * @returns コンポーネント
 */
export function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Version. 1.0.0-beta.1 - Copyright © '}
      <Link color="inherit" href="https://www.liveness.co.jp/">
        liveness, Inc.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
