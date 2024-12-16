const supabase = require('../config/database');

exports.getPotsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get pots that are either owned by the user or shared with them
        const { data: pots, error } = await supabase
            .from('pots')
            .select(`
                *,
                participants:pot_participants(
                    participant:participant_id(
                        id,
                        first_name,
                        last_name
                    )
                )
            `)
            .or(`user_id.eq.${userId},shared_with_id.eq.${userId}`);

        if (error) throw error;

        // Transform the data to match the expected format
        const userPots = pots.map(pot => ({
            ...pot,
            participants: pot.participants.map(p => p.participant)
        }));

        req.userPots = userPots;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getPotById = async (req, res, next) => {
    try {
        const potId = req.params.id;

        const { data: pot, error } = await supabase
            .from('pots')
            .select(`
                *,
                participants:pot_participants(
                    participant:participant_id(
                        id,
                        first_name,
                        last_name
                    )
                )
            `)
            .eq('id', potId)
            .single();

        if (error) throw error;
        if (!pot) {
            return res.status(404).send('Pot not found');
        }

        // Transform the participants data
        pot.participants = pot.participants.map(p => p.participant);

        pot.type = 'pot';

        req.pot = pot;
        next();
    } catch (error) {
        next(error);
    }
};

exports.createPot = async (req, res, next) => {
    try {
        const {
            name,
            targetAmount,
            targetDate = null,
            sharedWithId = null,
            participants = []
        } = req.body;
        const userId = req.user.id;

        const { data: newPot, error: potError } = await supabase
            .from('pots')
            .insert([{
                name,
                target_amount: targetAmount,
                actual_amount: 0,
                target_date: targetDate,
                user_id: userId,
                shared_with_id: sharedWithId
            }])
            .select()
            .single();

        if (potError) throw potError;

        // Add participants if any
        if (participants.length > 0) {
            const participantRecords = participants.map(participantId => ({
                pot_id: newPot.id,
                participant_id: participantId
            }));

            const { error: participantsError } = await supabase
                .from('pot_participants')
                .insert(participantRecords);

            if (participantsError) throw participantsError;
        }

        req.pot = newPot;
        next();
    } catch (error) {
        next(error);
    }
};

exports.updatePot = async (req, res, next) => {
    try {
        const potId = req.params.id;
        const { ...updates } = req.body;
        const userId = req.user.id;

        // First verify the user owns this pot
        const { data: existingPot, error: fetchError } = await supabase
            .from('pots')
            .select('*')
            .eq('id', potId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingPot) {
            return res.status(403).send('Not authorized to update this pot');
        }

        // Update the pot
        const { data: updatedPot, error: updateError } = await supabase
            .from('pots')
            .update({
                ...updates,
            })
            .eq('id', potId)
            .select()
            .single();

        if (updateError) throw updateError;

        // Update participants if provided
        if (updates.participants) {
            // Remove existing participants
            const { error: deleteError } = await supabase
                .from('pot_participants')
                .delete()
                .eq('pot_id', potId);

            if (deleteError) throw deleteError;

            // Add new participants
            if (updates.participants.length > 0) {
                const participantRecords = updates.participants.map(participantId => ({
                    pot_id: potId,
                    participant_id: participantId
                }));

                const { error: participantsError } = await supabase
                    .from('pot_participants')
                    .insert(participantRecords);

                if (participantsError) throw participantsError;
            }
        }

        req.pot = updatedPot;
        next();
    } catch (error) {
        next(error);
    }
};

exports.deletePot = async (req, res, next) => {
    try {
        const potId = req.params.id;
        const userId = req.user.id;

        // First verify the user owns this pot
        const { data: existingPot, error: fetchError } = await supabase
            .from('pots')
            .select('*')
            .eq('id', potId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingPot) {
            return res.status(403).send('Not authorized to delete this pot');
        }

        // Delete the pot (cascade will handle pot_participants)
        const { error: deleteError } = await supabase
            .from('pots')
            .delete()
            .eq('id', potId);

        if (deleteError) throw deleteError;

        next();
    } catch (error) {
        next(error);
    }
};

exports.updatePotAmount = async (req, res, next) => {
    try {
        const potId = req.params.id;
        const { amount } = req.body;
        const userId = req.user.id;

        // First get the current amount
        const { data: pot, error: fetchError } = await supabase
            .from('pots')
            .select('actual_amount')
            .eq('id', potId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!pot) {
            return res.status(404).send('Pot not found');
        }

        // Update the amount
        const { data: updatedPot, error: updateError } = await supabase
            .from('pots')
            .update({
                actual_amount: pot.actual_amount + amount
            })
            .eq('id', potId)
            .select()
            .single();

        if (updateError) throw updateError;

        req.pot = updatedPot;
        next();
    } catch (error) {
        next(error);
    }
};
