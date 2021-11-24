import { ethers } from 'ethers';
import { getJsonRpcUrl } from 'forta-agent';
import { DESTROYED_CONTRACT } from './constants'

export class ContractUtils {

    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
    }

    public async isContractEmpty(address: string): Promise<boolean> {
        // query the contract code
        const contractCode = await this.provider.getCode(address);
        return contractCode == DESTROYED_CONTRACT;
    }

}