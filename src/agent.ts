import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import { UPGRADE_EVENT,
  OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
  OZ_UPGRADE_SELFDESTRUCT_1_NAME,
  OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
  PROTOCOL
 } from './constants'

import { ContractUtils } from './ContractUtils';

const contractUtils = new ContractUtils();

function provideHandleTransaction(contractUtils: ContractUtils) {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = []

    const upgradeEvents = txEvent.filterLog(
      UPGRADE_EVENT
    );
    for (const aUpgradeEvent of upgradeEvents) {
      // check if the contract was destructed.
      if (await contractUtils.isContractEmpty(aUpgradeEvent.address)) {
        findings.push(
          Finding.fromObject({
            name: OZ_UPGRADE_SELFDESTRUCT_1_NAME,
            description: OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
            alertId: OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
            severity: FindingSeverity.Critical,
            type: FindingType.Suspicious,
            protocol : PROTOCOL,
            metadata: {
              from: txEvent.from,
              contractDestructed: aUpgradeEvent.address
            },
          })
        );
      }
    }

    return findings
}
}

export default {
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(contractUtils),
}