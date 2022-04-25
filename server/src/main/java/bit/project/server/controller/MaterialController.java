package bit.project.server.controller;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.dao.SupplierDao;
import bit.project.server.entity.*;
import bit.project.server.dao.MaterialDao;
import bit.project.server.util.helper.FileHelper;
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
@RequestMapping("/materials")
public class MaterialController{

    @Autowired
    private MaterialDao materialDao;


    @Autowired
    private FileDao fileDao;

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public MaterialController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("material");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("MA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Material> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all materials", UsecaseList.SHOW_ALL_MATERIALS);

        if(pageQuery.isEmptySearch()){
            return materialDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer materialsubcategoryId = pageQuery.getSearchParamAsInteger("materialsubcategory");
        String name = pageQuery.getSearchParam("name");
        Integer statusId = pageQuery.getSearchParamAsInteger("status");

        List<Material> materials = materialDao.findAll(DEFAULT_SORT);
        Stream<Material> stream = materials.parallelStream();

        List<Material> filteredMaterials = stream.filter(material -> {
            if(code!=null)
                if(!material.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(materialsubcategoryId!=null)
                if(!material.getMaterialsubcategory().getId().equals(materialsubcategoryId)) return false;
            if(statusId!=null)
                if(!material.getMaterialstatus().getId().equals(statusId)) return false;
            if(name!=null)
                if(!material.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredMaterials, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Material> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materials' basic data", UsecaseList.SHOW_ALL_MATERIALS);
        return materialDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/basic/actives")
    public Page<Material> getAllBasicActives(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materials' basic data", UsecaseList.SHOW_ALL_MATERIALS);
        return materialDao.findByBasicActives(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/basic/actives/supplier/{supplierId}")
    public Set<Material> getAllBasicActivesBySupplier(@PathVariable Integer supplierId, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materials' basic data", UsecaseList.SHOW_ALL_MATERIALS);

        Optional<Supplier> optionalSupplier = supplierDao.findById(supplierId);
        if(optionalSupplier.isEmpty()) throw new ObjectNotFoundException("Supplier not found");
        Supplier supplier = optionalSupplier.get();
        List<Materialcategory> categories = supplier.getMaterialcategoryList();

        Set<Material> materials = new LinkedHashSet<>();

        for (Materialcategory category:categories) {
            for (Materialsubcategory subcategory: category.getMaterialcategoryMaterialsubcategoryList()) {
                materials.addAll(subcategory.getMaterialsubcategoryMaterialList());
            }
        }

        return materials;
    }

    @GetMapping("/{id}")
    public Material get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get material", UsecaseList.SHOW_MATERIAL_DETAILS);
        Optional<Material> optionalMaterial = materialDao.findById(id);
        if(optionalMaterial.isEmpty()) throw new ObjectNotFoundException("Material not found");
        return optionalMaterial.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete materials", UsecaseList.DELETE_MATERIAL);

        try{
            if(materialDao.existsById(id)) materialDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this material already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Material material, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new material", UsecaseList.ADD_MATERIAL);

        material.setTocreation(LocalDateTime.now());
        material.setCreator(authUser);
        material.setId(null);
        material.setMaterialstatus(new Materialstatus(1));;


        EntityValidator.validate(material);

        PersistHelper.save(()->{
            material.setCode(codeGenerator.getNextId(codeConfig));
            return materialDao.save(material);
        });

        return new ResourceLink(material.getId(), "/materials/"+material.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Material material, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update material details", UsecaseList.UPDATE_MATERIAL);

        Optional<Material> optionalMaterial = materialDao.findById(id);
        if(optionalMaterial.isEmpty()) throw new ObjectNotFoundException("Material not found");
        Material oldMaterial = optionalMaterial.get();

        material.setId(id);
        material.setCode(oldMaterial.getCode());
        material.setCreator(oldMaterial.getCreator());
        material.setTocreation(oldMaterial.getTocreation());


        EntityValidator.validate(material);

        material = materialDao.save(material);
        return new ResourceLink(material.getId(), "/materials/"+material.getId());
    }



    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_MATERIAL_DETAILS);

        Optional<Material> optionalMaterial = materialDao.findById(id);
        if(optionalMaterial.isEmpty()) throw new ObjectNotFoundException(" not found");
        Material material = optionalMaterial.get();

        Optional<File> optionalFile = fileDao.findFileById(material.getPhoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }


}
