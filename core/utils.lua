utils = { }
utils.__index = utils

function utils.addTextComponent(component)
	local componentType = type(component)
	if componentType == 'string' then
		AddTextComponentString(component)
	elseif componentType == 'number' then
		if math.tointeger(component) then
			AddTextComponentInteger(component)
		else
			AddTextComponentFloat(component, 2) -- TODO:
		end
	end
end

function utils.addTextComponents(components)
	for _, component in ipairs(components) do
		utils.addTextComponent(component)
	end
end
