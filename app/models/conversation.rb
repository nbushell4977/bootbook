class Conversation < ApplicationRecord
  belongs_to :sender, class_name: 'User', foreign_key: :sender_id
  belongs_to :recipient, class_name: 'User', foreign_key: :recipient_id
  belongs_to :variety, class_name: 'ConversationVariety', foreign_key: :conversation_variety_id
  has_many :messages, dependent: :destroy

  validates_presence_of :sender_id, :recipient_id, :conversation_variety_id
  validates_uniqueness_of :sender_id, scope: [:recipient_id, :conversation_variety_id]

  scope :involving, -> (user) do
    where("conversations.sender_id = ? OR conversations.recipient_id = ?", user.id, user.id)
  end

  scope :between, -> (sender_id,recipient_id) do
    where('(conversations.sender_id = ? AND conversations.recipient_id =?) OR (conversations.sender_id = ? AND conversations.recipient_id =?)', sender_id,recipient_id, recipient_id, sender_id)
  end

end
