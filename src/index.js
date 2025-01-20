import { derivePath } from 'ed25519-hd-key';
import { mnemonicToSeed } from 'bip39';
import { keyPairFromSeed } from '@ton/crypto';
import { WalletContractV5R1, WalletContractV4, WalletContractV3R2 } from '@ton/ton';

const walletsMap = {
  W5: WalletContractV5R1,
  v4R2: WalletContractV4,
  v3R2: WalletContractV3R2,
};

async function extractKeysFromBip39Mnemonic(mnemonic, index) {
  const seed = await mnemonicToSeed(mnemonic);
  const seedContainer = derivePath(`m/44'/607'/${index}'`, seed.toString('hex'));
  const keyPair = keyPairFromSeed(seedContainer.key);
  const { publicKey, secretKey } = keyPair;

  const publicKeyHex = publicKey.toString('hex');
  const privateKeyHex = secretKey.toString('hex').slice(0, 64);

  const wallets = {};

  for (const [version, walletClass] of Object.entries(walletsMap)) {
    const wallet = walletClass.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });
    const address = wallet.address.toString({ bounceable: false });

    wallets[version] = address;
  }

  return { wallets, publicKeyHex, privateKeyHex };
}

export {
  extractKeysFromBip39Mnemonic,
};
