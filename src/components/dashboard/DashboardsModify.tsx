import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Dashboard, DashboardItem, useDashboardsState} from "../../storage/Dashboard"
import SectionContainer from "../sections/SectionContainer"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {DragEndEvent} from "@dnd-kit/core/dist/types"
import {CSS} from "@dnd-kit/utilities"
import PageTitle from "../sections/PageTitle"
import EditIcon from "../icons/EditIcon"
import {EditWidget} from "./EditWidget"
import AnimateHeight from "react-animate-height"
import DragIcon from "../icons/DragIcon"
import {twMerge} from "../../helpers/TwMerge"
import {Cross1Icon} from "@radix-ui/react-icons"
import DeleteIcon from "../icons/DeleteIcon"
import CheckIcon from "../icons/CheckIcon"
import {AddWidget} from "./AddWidget"
import {LinkButton} from "../buttons/LinkButton"
import {Toast} from "../toast/Toast"

type SortableItem = { id: UniqueIdentifier, item: DashboardItem }

export function DashboardsModify() {
    const {dashboards, updateDashboard: updateAndSaveDashboard} = useDashboardsState()
    const [dashboardId] = useState<number>(parseInt(useParams().dashboardId as string))
    const [currentDashboard] = useState<Dashboard | undefined>(dashboards[dashboardId])
    const [items, setItems] = useState<SortableItem[]>(
        currentDashboard?.items.map((item, index) => ({id: index + 1, item})) ?? [],
    )
    const [toastOpen, setToastOpen] = useState<boolean>(false)
    const [open, setOpen] = useState<UniqueIdentifier>(0)

    useEffect(() => {
        if (toastOpen) {
            setTimeout(() => setToastOpen(false), 3000)
        }
    }, [toastOpen])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    function setItemsAndUpdateDashboard(items: SortableItem[]) {
        setItems(items)
        updateAndSaveDashboard(
            dashboardId,
            {
                items: items.map(({item}) => item),
            },
        )
        setToastOpen(true)
    }

    function addWidgetToDashboard(item: DashboardItem) {
        setItemsAndUpdateDashboard([...items, {id: items.length + 2, item}])
    }

    function editItem(id: UniqueIdentifier, newItem: DashboardItem) {
        setOpen(0)
        setItemsAndUpdateDashboard(items.map((item) => item.id === id ? {id, item: newItem} : item))
    }

    function deleteItem(id: UniqueIdentifier) {
        setItemsAndUpdateDashboard(items.filter((item) => item.id !== id))
    }

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event

        if (over !== null && active.id !== over.id) {
            const oldIndex = items.findIndex(({id}) => id === active.id)
            const newIndex = items.findIndex(({id}) => id === over.id)
            const i = arrayMove(items, oldIndex, newIndex)
            setItemsAndUpdateDashboard(i)
        }
    }

    if (currentDashboard === undefined) {
        return <>404</>
    }

    return <SectionContainer className="sm:pt-12">
        <Toast title={"Dashboard saved"} open={toastOpen}/>

        <LinkButton href={`/?dashboard=${dashboardId}`} className="sm:hidden mb-4 text-sm">
            ← Back to Dashboard
        </LinkButton>

        <PageTitle title="Configure your Dashboard"/>

        <div className="pt-4 grid gap-4 grid-cols-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(({id, item}, index) => (
                        <SortableItemView
                            key={id}
                            id={id}
                            item={item}
                            dragEnabled={open === 0}
                            open={open === id}
                            setOpen={(item: UniqueIdentifier) => setOpen(item)}
                            deleteItem={deleteItem}
                            editItem={editItem}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <AddWidget
                addWidgetToDashboard={addWidgetToDashboard}
                className="rounded border-solid border text-sm px-4 py-5"
                formClassName="rounded border-solid border"
            />

            <LinkButton href={`/?dashboard=${dashboardId}`} className="hidden sm:block text-sm mt-4">
                ← Back to Dashboard
            </LinkButton>
        </div>
    </SectionContainer>
}

function SortableItemView(
    {
        id, item, dragEnabled, open, setOpen, deleteItem, editItem,
    }: {
        id: UniqueIdentifier,
        item: DashboardItem,
        dragEnabled?: boolean,
        open: boolean,
        setOpen: (item: UniqueIdentifier) => void
        deleteItem: (item: UniqueIdentifier) => void
        editItem: (item: UniqueIdentifier, newItem: DashboardItem) => void
    },
) {
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false)
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: id})
    const style = {transform: CSS.Transform.toString(transform), transition}

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={twMerge(
                "py-4 px-4",
                "rounded-md shadow",
                "bg-white dark:bg-zinc-800/10",
                "border dark:border-zinc-800 transition-shadow duration-300",
                {"shadow-lg dark:bg-zinc-900 dark:border-zinc-700 z-50": isDragging},
            )}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    {dragEnabled ?
                        <div className="cursor-grab" {...attributes} {...listeners}>
                            <DragIcon className="w-4"/>
                        </div> :
                        <div className="cursor-not-allowed opacity-30 smooth-all">
                            <DragIcon className="w-4"/>
                        </div>
                    }

                    <div>{item.title}</div>
                </div>
                <ul className="flex items-center gap-4">
                    {!open && <>
                        <li
                            onClick={() => setOpen(id)}
                            className="cursor-pointer"
                        >
                            <div className="smooth-all p-2 rounded bg-blue-50/50 border border-blue-100 hover:bg-blue-100 dark:bg-zinc-800/50 dark:border-blue-900/40 hover:dark:bg-blue-900/10 hover:dark:border-blue-900/75">
                                <EditIcon className="w-4 text-blue-500"/></div>
                        </li>
                        <li
                            className="cursor-pointer"
                            onClick={() => {
                                if (!deleteConfirm) {
                                    setDeleteConfirm(true)
                                    return
                                }

                                deleteItem(id)
                            }}>
                            <div className={twMerge(
                                "smooth-all p-2 rounded bg-red-50/50 border border-red-100 hover:bg-red-100 dark:bg-red-900/10 dark:border-red-900/25 hover:dark:bg-red-900/50 hover:dark:border-red-900/75",
                                {"bg-red-100 border-red-200 dark:border-red-900/50 dark:bg-red-900/75": deleteConfirm},
                            )}>
                                {!deleteConfirm && <DeleteIcon className="w-4 text-red-500"/>}
                                {deleteConfirm && <CheckIcon className="w-4 text-red-500"/>}
                            </div>
                        </li>
                    </>}

                    {open && <>
                        <li onClick={() => setOpen(0)} className="cursor-pointer">
                            <div
                                className="text-sm smooth-all p-1.5 rounded bg-red-50/50 hover:bg-red-100"
                            >
                                <Cross1Icon className="text-red-500 w-3.5 h-auto"/>
                            </div>
                        </li>
                    </>}
                </ul>
            </div>

            <AnimateHeight id={`edit-${id}`} height={open ? "auto" : 0} duration={300}>
                <div className="flex items-center justify-center overflow-hidden">
                    <div className="pt-5 w-full">
                        <EditWidget
                            eventUuid={item.eventUuid}
                            eventTitle={item.title}
                            eventSize={item.size}
                            eventType={item.type}
                            closeWidgetForm={() => null}
                            editWidget={(newItem) => editItem(id, newItem)}
                        />
                    </div>
                </div>
            </AnimateHeight>
        </div>
    )
}
