import { npmInstall, npmStart } from './npm'
import { gitClone, gitOpen, gitPull, gitSync } from './git'

const factorial = async ({ num }: Record<string, number>) => {
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

export { npmInstall, npmStart, gitClone, gitOpen, gitPull, gitSync, factorial }
