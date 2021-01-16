import { Install, Start } from './npm'
import { Clone, Commit } from './git'

export const factorial = async ({ num }: Record<string, number>) => {
  function fact(n: number): number {
    if (n === 1) {
      return 1
    }
    return n * fact(n - 1)
  }

  console.log('making factorial')
  return fact(num)
}

export const ring = async () => {
  console.log('picking up the phone')
  return 'hello!'
}

export const gitClone = async ({ url, path }: Record<string, string>) => {
  Clone(url, path)
}

export const gitCommit = async ({ path }: Record<string, string>) => {
  Commit(path)
}

export const npmInstall = async ({ path }: Record<string, string>) => {
  Install(path)
}

export const npmStart = async ({ path, script }: Record<string, string>) => {
  Start(path, script)
}
