import type { TServices } from 'common/backend.types';
import Tag, { ETagType } from '../Tag';

type TTags = {
  services: TServices;
  roles: string[];
};

function Tags({ services, roles }: TTags) {
  const enabledServices = Object.entries(services).filter(([_, isEnabled]) => isEnabled);

  return (
    <div>
      {roles.map(role => <Tag type={ETagType.Role} key={role} value={role} />)}

      {enabledServices.map(([service]) => (
        <Tag type={ETagType.Service} key={service} value={service} />
      ))}
    </div>

  );
}

export default Tags;
