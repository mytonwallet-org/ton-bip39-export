import { derivePath } from 'ed25519-hd-key';
import { mnemonicToSeed } from 'bip39';
import { keyPairFromSeed } from '@ton/crypto';
import { WalletContractV5R1 } from '@ton/ton';

async function extractKeysFromBip39Mnemonic(mnemonic, index) {
  const seed = await mnemonicToSeed(mnemonic);
  const seedContainer = derivePath(`m/44'/607'/${index}'`, seed.toString('hex'));
  const keyPair = keyPairFromSeed(seedContainer.key);
  const { publicKey, secretKey } = keyPair;

  const publicKeyHex = publicKey.toString('hex');
  const privateKeyHex = secretKey.toString('hex').slice(0, 64);

  const wallet = WalletContractV5R1.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });
  const address = wallet.address.toString({ bounceable: false });

  return { wallet, address, publicKeyHex, privateKeyHex };
}

export {
  extractKeysFromBip39Mnemonic,
};
