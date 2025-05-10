import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import type { Construct } from 'constructs'
import {
  ARecord,
  CaaRecord,
  CaaTag,
  PublicHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'

interface Props extends StackProps {
  domainName: string
}

export class Network extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const zone = new PublicHostedZone(this, 'hosted-zone', {
      zoneName: props.domainName,
    })

    new StringParameter(this, 'hosted-zone-id', {
      parameterName: `/${props.stage}/${props.projectName}/hosted-zone-id`,
      stringValue: zone.hostedZoneId,
    })

    new ARecord(this, 'a', {
      recordName: props.domainName,
      target: RecordTarget.fromIpAddresses('76.76.21.21'),
      zone,
    })

    new ARecord(this, 'app-a', {
      recordName: `app.${props.domainName}`,
      target: RecordTarget.fromIpAddresses('76.76.21.21'),
      zone,
    })

    new CaaRecord(this, 'caa', {
      recordName: props.domainName,
      values: [
        {
          flag: 0,
          tag: CaaTag.ISSUE,
          value: 'amazon.com',
        },
        {
          flag: 0,
          tag: CaaTag.ISSUE,
          value: 'amazontrust.com',
        },
        {
          flag: 0,
          tag: CaaTag.ISSUE,
          value: 'awstrust.com',
        },
        {
          flag: 0,
          tag: CaaTag.ISSUE,
          value: 'amazonaws.com',
        },
      ],
      zone,
    })
  }
}
