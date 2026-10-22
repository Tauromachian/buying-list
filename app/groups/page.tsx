"use client";

import { useState } from "react";

import { Group } from "@/lib/dto/group";
import { classesMerge } from "@/utils/component-classes";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { EmptyState } from "@/components/EmptyState";
import { InputText } from "@/components/InputText";

export type GroupMember = {
  userId: string;
  email: string | null;
};

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>("");

  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();

  function selectGroup() {}
  function addGroup(group: Group) {}
  function removeGroup() {}
  function addMember() {}
  function removeMember(id: number | string) {}

  return (
    <div>
      <Card>
        <p className="text-md font-bold">My Groups</p>
        <p className="text-sm text-text-0 mt-1">
          Share expenses and incomes with the members of a group.
        </p>

        <div className="flex gap-2 mt-4">
          <InputText
            state={newGroupName}
            setState={setNewGroupName}
            name="groupName"
            no-error
            placeholder="New group name"
            className="flex-1"
            onKeyDown={() => addGroup}
          />

          <Button onClick={() => addGroup}>Create</Button>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          {groups.length ? (
            groups.map((group) => (
              <button
                key={group.id}
                className={classesMerge(
                  "text-left px-4 py-3 rounded-xl border cursor-pointer",
                  group.id === selectedGroup?.id
                    ? "border-accent-0 text-text-1"
                    : "border-neutral-1 text-text-0",
                )}
                onClick={selectGroup}
              >
                {group.name}
              </button>
            ))
          ) : (
            <p v-else className="text-sm text-text-0 mt-4">
              No groups yet. Create one above.
            </p>
          )}
        </div>
      </Card>

      {selectedGroup && (
        <Card>
          <p className="text-md font-bold">{selectedGroup.name} members</p>

          <div className="flex gap-2 mt-4">
            <input
              v-model="newMemberEmail"
              type="email"
              placeholder="Member email"
              className="text-field"
              onKeyDown={() => addMember}
            />
            <Button onClick={() => addMember}>Add</Button>
          </div>

          {members.length ? (
            <div className="flex flex-col gap-2 mt-4">
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-1"
                >
                  <span className="text-sm text-text-1">
                    {member.email ?? member.userId}
                  </span>
                  <span className="text-xs text-text-0">(you)</span>
                  <button
                    className="ml-auto text-sm text-red-600 cursor-pointer"
                    onClick={() => removeMember(member.userId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState></EmptyState>
          )}

          <div className="w-full flex">
            <Button
              variant="outlined"
              className="mt-5 ml-auto"
              onClick={() => setIsDeleteConfirmationDialogOpen(true)}
            >
              Delete group
            </Button>
          </div>
        </Card>
      )}

      <DeleteConfirmationDialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        onDelete={() => removeGroup()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
