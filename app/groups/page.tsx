"use client";

import { useEffect, useState } from "react";

import { Group } from "@/lib/dto/group";
import { classesMerge } from "@/utils/component-classes";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Dialog } from "@/components/Dialog";
import { EmptyState } from "@/components/EmptyState";
import { InputText } from "@/components/InputText";
import { Loader } from "@/components/Loader";

import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from "@/lib/api/groups";
import { toast } from "react-toastify";

export type GroupMember = {
  userId: string;
  email: string | null;
};

function assertGroup(group?: Group, msg?: string): asserts group is Group {
  msg ??= "This object should be of type Group.";

  if (!group) throw new Error(msg);

  if (!group.id || !group.name) throw new Error(msg);
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
  const [renameName, setRenameName] = useState<string>("");

  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async function () {
    setIsLoading(true);
    setLoadError(null);

    try {
      setGroups(await getGroups());
    } catch (error) {
      console.error(error);
      setLoadError("Couldn't load groups.");
    }

    setIsLoading(false);
  };

  function selectGroup(group: Group) {
    setSelectedGroup(group);
  }

  async function addGroup() {
    const name = newGroupName.trim();

    if (!name) return;

    try {
      const inserted = await createGroup({ name });

      setGroups((prev) => [...prev, inserted]);
      setNewGroupName("");
      toast.success("Group created!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't create the group.");
    }
  }

  async function renameGroup() {
    assertGroup(selectedGroup);

    const name = renameName.trim();

    if (!name) return;

    try {
      await updateGroup(selectedGroup.id, { name });

      // Keep the selected row live with the rename — avoids a reload, whose
      // fresh objects would detach `selectedGroup` from the rendered rows.
      setGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroup.id ? { ...group, name } : group,
        ),
      );
      setSelectedGroup({ ...selectedGroup, name });

      setIsRenameDialogOpen(false);
      toast.success("Group renamed!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't rename the group.");
    }
  }

  async function removeGroup() {
    assertGroup(selectedGroup);

    try {
      await deleteGroup(selectedGroup.id);

      setGroups((prev) =>
        prev.filter((group) => group.id !== selectedGroup.id),
      );
      setSelectedGroup(undefined);

      setIsDeleteConfirmationDialogOpen(false);
      toast.success("Group deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete the group.");
    }
  }

  // Members are UI sketches until a membership endpoint (and the user's
  // identity model: the members table shows emails the schema doesn't hold)
  // exists to back them.
  function addMember() {}
  function removeMember(id: number | string) {}

  let content: React.ReactNode;
  if (loadError) {
    content = (
      <div className="flex flex-col items-center gap-3" role="alert">
        <p>{loadError}</p>
        <Button onClick={() => loadData()}>Try again</Button>
      </div>
    );
  } else if (isLoading) {
    content = <Loader size="md" className="my-10"></Loader>;
  } else if (groups.length === 0) {
    content = <EmptyState text="No groups yet. Create one above!" />;
  } else {
    content = groups.map((group) => (
      <button
        key={group.id}
        className={classesMerge(
          "text-left px-4 py-3 rounded-xl border cursor-pointer",
          group.id === selectedGroup?.id
            ? "border-accent-0 text-text-1"
            : "border-neutral-1 text-text-0",
        )}
        onClick={() => selectGroup(group)}
      >
        {group.name}
      </button>
    ));
  }

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
            placeholder="New group name"
            className="flex-1"
            onKeyDown={(event) => event.key === "Enter" && addGroup()}
          />

          <Button onClick={() => addGroup()}>Create</Button>
        </div>

        <div className="flex flex-col gap-3 mt-5">{content}</div>
      </Card>

      {selectedGroup && (
        <Card className="mt-7">
          <p className="text-md font-bold">{selectedGroup.name} members</p>

          <div className="flex gap-2 mt-4">
            <InputText
              state={newMemberEmail}
              setState={setNewMemberEmail}
              name="memberEmail"
              type="email"
              placeholder="Member email"
              className="flex-1"
              autoComplete="off"
              onKeyDown={(event) => event.key === "Enter" && addMember()}
            />
            <Button onClick={() => addMember()}>Add</Button>
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

          <div className="w-full flex gap-2">
            <Button
              variant="outlined"
              className="mt-5 ml-auto"
              onClick={() => {
                assertGroup(selectedGroup);
                setRenameName(selectedGroup.name);
                setIsRenameDialogOpen(true);
              }}
            >
              Rename
            </Button>

            <Button
              variant="outlined"
              className="mt-5"
              onClick={() => setIsDeleteConfirmationDialogOpen(true)}
            >
              Delete group
            </Button>
          </div>
        </Card>
      )}

      <Dialog
        open={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        title="Rename group"
      >
        <Card>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              renameGroup();
            }}
            className="flex flex-col gap-3"
          >
            <InputText
              label="Name"
              state={renameName}
              setState={setRenameName}
              name="name"
            ></InputText>

            <Button className="ml-auto">Save</Button>
          </form>
        </Card>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        onDelete={() => removeGroup()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
