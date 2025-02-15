import { useServices } from '@shared/hooks/useServices';
import { SendEnquiryCommand } from '@searchResult/commands/sendEnquiry.command';

export const useSendEnquiry = () => {
	const { sendEnquiryUseCase } = useServices();

	const execute = async (command: SendEnquiryCommand) => {
		return await sendEnquiryUseCase.execute(command);
	};

	return { execute };
};
