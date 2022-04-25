package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Materialsubcategory;
import bit.project.server.dao.MaterialsubcategoryDao;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/materialsubcategories")
public class MaterialsubcategoryController{

    @Autowired
    private MaterialsubcategoryDao materialsubcategoryDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public MaterialsubcategoryController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("materialsubcategory");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("MS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Materialsubcategory> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all materialsubcategories", UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES);

        if(pageQuery.isEmptySearch()){
            return materialsubcategoryDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer materialcategoryId = pageQuery.getSearchParamAsInteger("materialcategory");
        String name = pageQuery.getSearchParam("name");

        List<Materialsubcategory> materialsubcategories = materialsubcategoryDao.findAll(DEFAULT_SORT);
        Stream<Materialsubcategory> stream = materialsubcategories.parallelStream();

        List<Materialsubcategory> filteredMaterialsubcategories = stream.filter(materialsubcategory -> {
            if(code!=null)
                if(!materialsubcategory.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(materialcategoryId!=null)
                if(!materialsubcategory.getMaterialcategory().getId().equals(materialcategoryId)) return false;
            if(name!=null)
                if(!materialsubcategory.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredMaterialsubcategories, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Materialsubcategory> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materialsubcategories' basic data", UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES, UsecaseList.ADD_MATERIAL, UsecaseList.UPDATE_MATERIAL);
        return materialsubcategoryDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Materialsubcategory get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get materialsubcategory", UsecaseList.SHOW_MATERIALSUBCATEGORY_DETAILS);
        Optional<Materialsubcategory> optionalMaterialsubcategory = materialsubcategoryDao.findById(id);
        if(optionalMaterialsubcategory.isEmpty()) throw new ObjectNotFoundException("Materialsubcategory not found");
        return optionalMaterialsubcategory.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete materialsubcategories", UsecaseList.DELETE_MATERIALSUBCATEGORY);

        try{
            if(materialsubcategoryDao.existsById(id)) materialsubcategoryDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this materialsubcategory already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Materialsubcategory materialsubcategory, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new materialsubcategory", UsecaseList.ADD_MATERIALSUBCATEGORY);

        materialsubcategory.setTocreation(LocalDateTime.now());
        materialsubcategory.setCreator(authUser);
        materialsubcategory.setId(null);


        EntityValidator.validate(materialsubcategory);

        PersistHelper.save(()->{
            materialsubcategory.setCode(codeGenerator.getNextId(codeConfig));
            return materialsubcategoryDao.save(materialsubcategory);
        });

        return new ResourceLink(materialsubcategory.getId(), "/materialsubcategories/"+materialsubcategory.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Materialsubcategory materialsubcategory, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update materialsubcategory details", UsecaseList.UPDATE_MATERIALSUBCATEGORY);

        Optional<Materialsubcategory> optionalMaterialsubcategory = materialsubcategoryDao.findById(id);
        if(optionalMaterialsubcategory.isEmpty()) throw new ObjectNotFoundException("Materialsubcategory not found");
        Materialsubcategory oldMaterialsubcategory = optionalMaterialsubcategory.get();

        materialsubcategory.setId(id);
        materialsubcategory.setCode(oldMaterialsubcategory.getCode());
        materialsubcategory.setCreator(oldMaterialsubcategory.getCreator());
        materialsubcategory.setTocreation(oldMaterialsubcategory.getTocreation());


        EntityValidator.validate(materialsubcategory);

        materialsubcategory = materialsubcategoryDao.save(materialsubcategory);
        return new ResourceLink(materialsubcategory.getId(), "/materialsubcategories/"+materialsubcategory.getId());
    }

}