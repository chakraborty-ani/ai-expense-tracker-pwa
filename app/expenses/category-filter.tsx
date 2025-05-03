"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

// COMPONENTS
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// TYPES
type Category = {
	categoryList: {
		label: string
		value: string
	}[]
    selectedCategory: string
    setSelectedCategory: (category: string) => void
}

const CategoryFilter = ({ categoryList, selectedCategory, setSelectedCategory }: Category) => {
	// STATE
	const [open, setOpen] = useState<boolean>(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedCategory
						? categoryList.find(category => category.value === selectedCategory)?.label
						: "Select category..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandEmpty>No category found.</CommandEmpty>
						<CommandGroup className="max-h-[200px] overflow-y-auto">
							{categoryList.map(category => (
								<CommandItem
									key={category.value}
									value={category.value}
									onSelect={currentValue => {
                                        console.log(currentValue)
										setSelectedCategory(
											currentValue === selectedCategory ? "" : currentValue
										)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedCategory === category.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{category.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default CategoryFilter
